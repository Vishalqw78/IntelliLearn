import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import io from "socket.io-client";
import { AuthContext } from '../context/AuthContext';
const socket = io.connect("https://intellilearn-f0dw.onrender.com");

function createTree(list) {
  const map = {};
  const roots = [];

  list.forEach((item, i) => {
    map[item.id] = i;
    list[i].children = [];
  });

  list.forEach((node) => {
    if (node.parentId) {
      if (map[node.parentId] !== undefined) {
        list[map[node.parentId]].children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function Comment({ comment, collapse, reply, deleteComment,author }) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const {currentUser} =useContext(AuthContext);
  const currentid= currentUser?.id;

  const toggleReply = () => setReplying(!replying);

  const nestedComments = (comment.children || []).map((childComment) => (
    <Comment
      key={childComment.id}
      comment={childComment}
      collapse={collapse}
      reply={reply}
      deleteComment={deleteComment}
      author={childComment.author.id}
    />
  ));

  const handleReply = () => {
    if (replyText.trim()) {
      reply(comment.id, replyText);
      setReplyText('');
      setReplying(false);
    }
  };

  const handleDelete = () => deleteComment(comment.id);
  
  return (
    <div className="ml-4 mt-2">
      <div className="flex items-center">
      {comment.author.id && (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.Name}
                    height={50}
                    width={50}
                    className="mr-2 h-6 w-6 rounded-full"
                  />
                )}
        <div className="font-bold">{comment.author.Name}</div>
        <div
          onClick={() => collapse(comment.id)}
          className="cursor-pointer ml-2 text-sm"
        >
          {comment.expanded ? `[-]` : `[+]`}
        </div>
        <div
          onClick={toggleReply}
          className="cursor-pointer ml-2 text-sm"
        >
          Reply
        </div>
        {author === currentid && (
          <div
            onClick={handleDelete}
            className="cursor-pointer ml-2 text-sm text-red-500"
          >
            Delete
          </div>
        )}
      </div>
      {currentid !== undefined && replying && (
        <div className="mt-2">
          <input
            type="text"
            value={replyText}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const text = e.target.value.trim();
                if (text) {
                  handleReply(null, text);
                  e.target.value = '';
                }
              }
            }
          }
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply..."
            className="w-full mb-2 p-2 rounded border border-gray-300"
          />
          
        </div>
      )}
      {comment.expanded && (
        <div className="mt-2">
          <div>{comment.text}</div>
          {nestedComments}
        </div>
      )}
    </div>
  );
}

export default function Comments({ postId, authorId }) {
  const [comments, setComments] = useState([]);
  const [commentTree, setCommentTree] = useState([]);
  const {currentUser} =useContext(AuthContext);
  const currentid= currentUser?.id;

  const socket = io.connect("https://intellilearn-f0dw.onrender.com");

  function sendMessage() {
    socket.emit("send_message", { message: "Hello from client" });
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      fetchComments();
    });

    // Clean up function to close the socket connection
    return () => {
      socket.close();
    };
  }, [socket]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://intellilearn-f0dw.onrender.com/api/comments?postId=${postId}`);
      if (Array.isArray(response.data)) {
        setComments(response.data);
        setCommentTree(createTree(response.data));
      } else {
        console.error('Fetched data is not an array:', response.data);
      }
    } catch (error) {
      console.error('There was an error fetching comments!', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  useEffect(() => {
    setCommentTree(createTree(comments));
  }, [comments]);

  const handleCommentCollapse = (id) => {
    setComments(comments.map((comment) => (
      comment.id === id
        ? { ...comment, expanded: !comment.expanded }
        : comment
    )));
  };

  const handleReply = async(parentId, replyText) => {
    try {
      await axios.post('https://intellilearn-f0dw.onrender.com/api/comments', {
        text: replyText,
        parentId,
        postId,
        authorId,
      });
      sendMessage(); // Moved sendMessage call here
      fetchComments(); // Refresh comments after adding a new one
    } catch (error) {
      console.error('Error adding comment:', error);
    }
    
  };

  const handleDelete = async(commentId) => {
    try {
      await axios.delete(`https://intellilearn-f0dw.onrender.com/api/comments/${commentId}`);
      sendMessage(); // Moved sendMessage call here
      fetchComments(); // Refresh comments after deleting one
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="p-4">
      {currentid !== undefined && <input
        type="text"
        placeholder="Add your first Comment..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const text = e.target.value.trim();
            if (text) {
              handleReply(null, text);
              e.target.value = '';
            }
          }
        }}
        className="w-full mb-4 p-2 rounded border border-gray-300"
      />}
      {commentTree.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          collapse={handleCommentCollapse}
          reply={handleReply}
          deleteComment={handleDelete}
          author={comment.author.id}
        />
      ))}
    </div>
  );
}

