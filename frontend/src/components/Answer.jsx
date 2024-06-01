import React, { useState, useEffect, useContext } from 'react';
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

function Answer({ answer, collapse, reply, deleteAnswer, author }) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const { currentUser } = useContext(AuthContext);
  const currentid = currentUser?.id;

  const toggleReply = () => setReplying(!replying);

  const nestedAnswers = (answer.children || []).map((childAnswer) => (
    <Answer
      key={childAnswer.id}
      answer={childAnswer}
      collapse={collapse}
      reply={reply}
      deleteAnswer={deleteAnswer}
      author={childAnswer.author.id}
    />
  ));

  const handleReply = () => {
    if (replyText.trim()) {
      reply(answer.id, replyText);
      setReplyText('');
      setReplying(false);
    }
  };

  const handleDelete = () => deleteAnswer(answer.id);

  return (
    <div className="ml-4 mt-2 mb-2 border-3">
      <div className="flex items-center">
      {answer.author.id && (
                  <img
                    src={answer.author.avatar}
                    alt={answer.author.Name}
                    height={50}
                    width={50}
                    className="mr-2 h-6 w-6 rounded-full"
                  />
                )}
        <div className="font-bold">{answer.author.Name}</div>
        <div
          onClick={() => collapse(answer.id)}
          className="cursor-pointer ml-2 text-sm"
        >
          {answer.expanded ? `[-]` : `[+]`}
        </div>
        {author === currentid && (
          <div
          onClick={toggleReply}
          className="cursor-pointer ml-2 text-sm"
        >
          Reply
        </div>
        )}
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
            }}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply..."
            className="w-full mb-2 p-2 rounded border border-gray-300"
          />
        </div>
      )}
      {answer.expanded && (
        <div className="mt-2">
          <div>{answer.text}</div>
          {nestedAnswers}
        </div>
      )}
    </div>
  );
}

export default function Answers({ questionId, authorId }) {
  const [answers, setAnswers] = useState([]);
  const [answerTree, setAnswerTree] = useState([]);
  const socket = io.connect("https://intellilearn-f0dw.onrender.com");
  const {currentUser} =useContext(AuthContext);
  const currentid= currentUser?.id;

  function sendMessage() {
    socket.emit("send_message", { message: "Hello from client" });
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      fetchAnswers();
    });

    // Clean up function to close the socket connection
    return () => {
      socket.close();
    };
  }, [socket]);

  const fetchAnswers = async () => {
    try {
      const response = await axios.get(`https://intellilearn-f0dw.onrender.com/api/answers?questionId=${questionId}`);
      if (Array.isArray(response.data)) {
        setAnswers(response.data);
        setAnswerTree(createTree(response.data));
      } else {
        console.error('Fetched data is not an array:', response.data);
      }
    } catch (error) {
      console.error('There was an error fetching answers!', error);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, [questionId]);

  useEffect(() => {
    setAnswerTree(createTree(answers));
  }, [answers]);

  const handleAnswerCollapse = (id) => {
    setAnswers(answers.map((answer) => (
      answer.id === id
        ? { ...answer, expanded: !answer.expanded }
        : answer
    )));
  };

  const handleReply = async (parentId, replyText) => {
    try {
      await axios.post('https://intellilearn-f0dw.onrender.com/api/answers', {
        text: replyText,
        parentId,
        questionId,
        authorId,
      });
      sendMessage(); // Moved sendMessage call here
      fetchAnswers(); // Refresh answers after adding a new one
    } catch (error) {
      console.error('Error adding answer:', error);
    }
  };

  const handleDelete = async (answerId) => {
    try {
      await axios.delete(`https://intellilearn-f0dw.onrender.com/api/answers/${answerId}`);
      sendMessage(); // Moved sendMessage call here
      fetchAnswers(); // Refresh answers after deleting one
    } catch (error) {
      console.error('Error deleting answer:', error);
    }
  };

  return (
    <div className="p-4 border-1">
     {currentid !== undefined && <input
        type="text"
        placeholder="Add your first Answer..."
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
      {answerTree.map((answer) => (
        <Answer
          key={answer.id}
          answer={answer}
          collapse={handleAnswerCollapse}
          reply={handleReply}
          deleteAnswer={handleDelete}
          author={answer.author.id}
        />
      ))}
    </div>
  );
}
