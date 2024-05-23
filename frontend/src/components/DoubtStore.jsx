import { useCallback, useState ,useContext} from "react";
import "../styles/abc.css"
import classNames from "classnames";
import ImageExtended from "../EditorComponents/ImageExtended.jsx";
import CodeBlock from "@tiptap/extension-code-block";

import { Video } from "../EditorComponents/VideoEmbed.js";
import { storage } from "../EditorComponents/firebase.js";
import { TextAlign } from "@tiptap/extension-text-align";
import { toast } from "react-toastify";

//import Youtube from "@tiptap/extension-youtube";
import PostLoader from "./PostLoader.jsx";
import Youtube from "../EditorComponents/youtube/index.js";
import Heading from "@tiptap/extension-heading";
import { ref, uploadBytesResumable, getDownloadURL,uploadString } from "firebase/storage";
import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
import CustomKeymap from "../EditorComponents/custom-keymap.js";
import DragAndDrop from "../EditorComponents/drag-and-drop.jsx";

import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

import Placeholder from "@tiptap/extension-placeholder";
import "../EditorComponents/styles.css";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import { SlashCommand } from "../EditorComponents/SlashCommand.jsx";
import content from "../EditorComponents/content.js";
import * as Icons from "../EditorComponents/Icons.jsx";
import { LinkModal } from "../EditorComponents/LinkModal.jsx";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import CharacterCount from '@tiptap/extension-character-count';
import { useNavigate } from "react-router-dom";

const Title = Heading.extend({
  name: "title",
  group: "title",
  parseHTML: () => [{ tag: "h1:first-child" }],
}).configure({ levels: [1] });

const DocumentWithTitle = Document.extend({
  content: "title block+",
});

const DoubtStoreEditor = ({ editorc }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {currentUser} =useContext(AuthContext);
  const UserID= currentUser?.id;
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        dropcursor: {
          color: "#DBEAFE",
          width: 4,
        },
      }),
      Underline,
      CharacterCount.configure({
        limit: 2000,
      }),
      Title,
      CodeBlock,
      DocumentWithTitle,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
        alignments: ["left", "center", "right", "justify"],
      }),

      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        // Not sure what the type of node is, so I'm using any
        placeholder: ({ node }) => {
          if (node.type.name === "title") {
            return "What's the Question?";
          }
          if (node.type.name === "heading") {
            return `Heading ${node.attrs.level}`;
          }
          return "Press '/' for commands, or enter some text...";
        },
        includeChildren: true,
      }),
      SlashCommand,

      Image.configure({
        HTMLAttributes: {
          class: "custom-image-small custom-image-float-none resizable",
        },
      }),
      ImageExtended,
      CustomKeymap,
      DragAndDrop,
      Video,
      Youtube.configure({
        inline: false,
        HTMLAttributes: {
          class: "ytvariable",
        },
      }),
    ],
    content: editorc,
    onUpdate: ({ editor }) => {
      const editorc = editor.getText();
    },
  });

  const [modalIsOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");

  let blobImages = [];
  let FirebaseArray = [];

  const handleImageUpload = useCallback(() => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", (e) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        const imageUrl = URL.createObjectURL(selectedFile);
        if (imageUrl) {
          editor.chain().focus().setImage({ src: imageUrl }).run(); // Insert the selected image
        }
      }
    });
    fileInput.click();
  }, [editor]);
  const replaceBlobImages = async () => {
    if (editor && blobImages.length > 0) {
      const tr = editor.state.tr;

      for (let index = 0; index < blobImages.length; index++) {
        const imageSrc = blobImages[index];
        const images = editor.view.dom.querySelectorAll("img");

        for (let i = 0; i < images.length; i++) {
          const imgNode = images[i];
          if (imgNode.src === imageSrc) {
            const nodePos = editor.view.posAtDOM(imgNode, -1); // Get node position
            const node = editor.state.doc.nodeAt(nodePos); // Get the node

            // Update the node attributes to change the src, width, and height
            tr.setNodeMarkup(nodePos, null, {
              src: FirebaseArray[index].src,
            });
          }
        }
      }

      editor.view.dispatch(tr);
      FirebaseArray = []; // Clear the FirebaseArray
      blobImages = []; // Clear the blobImages array
      console.log("Images replaced with Firebase URLs");
    }
  };

  const uploadBlobImagesToFirebase = async () => {
    if (editor) {
      editor.view.dom.querySelectorAll("img").forEach((imgNode) => {
        const imageSrc = imgNode.currentSrc;

        // Check if the image source is a blob URL
        if (imageSrc.startsWith("blob:")) {
          blobImages.push(imageSrc);
        }
      });
    }

    const uploadPromises = blobImages.map(async (blobImageUrl) => {
      const selectedFile = await fetch(blobImageUrl).then((response) =>
        response.blob(),
      );

      try {
        const date = new Date().getTime();
        const storageRef = ref(storage, `images/${date}_${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        await uploadTask;
        const downloadURL = await getDownloadURL(storageRef);

        FirebaseArray.push({ src: downloadURL }); // Push Firebase URL to FirebaseArray
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    });

    await Promise.all(uploadPromises); // Wait for all uploads to complete
    console.log("Blob images uploaded to Firebase");
  };
  function formatDate(timestamp) {
    const date = new Date(timestamp);
  
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
  }
  const extractTitle = (htmlString) => {
    const regex = /<h1>(.*?)<\/h1>(.*)/;
    const match = htmlString.match(regex);

    if (match) {
      const titlestring = match[1].trim();
      const title = titlestring.replace(/<[^>]*>/g, "");

      return { title };
    } else {
      // No <h1> tag found, return full content as title
      return { title: htmlString.trim()};
    }
  };
  const extractContent = (htmlString) => {
    const regex = /<h1>(.*?)<\/h1>(.*)/;
    const match = htmlString.match(regex);

    if (match) {
      const content = match[2].trim();

      return { content };
    } else {
      // No <h1> tag found, return full content as title
      return { content: htmlString.trim()};
    }
  };
  const isPublishDisabled = () => {
    // Check if title, content, or categories are empty
    const editorContent = editor.getHTML();
    const { title } = extractTitle(editorContent);
    const { content } = extractContent(editorContent);
  
    // Check if title length is not greater than 5
    const isTitleValid = title.length > 5;
  
    // Check if there is exactly one tag
    const isTagValid = tags.length >= 1;
  
    // Return true if any condition is not met
    return !isTitleValid || !isTagValid ;
  };
  
  
  const handlePublish = async () => {
    let publishButton = document.querySelector('.button'); // Declare outside try block

    try {
    if (publishButton) {
      publishButton.disabled = true;
    }

    // Check if title, content, or categories are empty
    if (isPublishDisabled()) {
      toast.error('Title, content, or categories are empty. Cannot publish.');
      return;
    }
      
      await handleButtonClick();
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found.");
        return;
      }
      const editorContent = editor.getHTML();
      const { title } = extractTitle(editorContent);
      const date =  new Date();
      const localfilename = `${title}${formatDate(date)}`
      const storageref = ref(storage,  `questionfile/${localfilename}.txt`);



      await uploadString(storageref, editor.getHTML());
      const downloadURL = await getDownloadURL(storageref);
      setLoading(true);

      const uploadfilename = downloadURL;

      const postData = {
        title,
        content : uploadfilename,
        Category : tags,
        date ,
      }

      console.log(postData);
      
      
      const response = await axios.post('http://localhost:8080/api/createQuestion',postData,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Handle the response as needed
      console.log('Publish successful:', response.data);
      navigate(`/question/${response.data.data.id}`);
    }
    catch (error) {
      // Handle errors
      console.error('Error publishing:', error);
    }finally {
      if (publishButton) {
        publishButton.disabled = false;
      }
      // Set loading state back to false when publishing is complete
      setLoading(false); 
    }
  };

  const handleSelectedGif = (gifUrl) => {
    // You can use the selected GIF URL in App.tsx as needed
    editor.chain().focus().setImage({ src: gifUrl }).run();
  };
  const [tagInput, setInput] = useState("");
  const [tags, setTags] = useState([]);
  const [keyReleased, setKeyReleased] = useState(false);

  const onTagChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };
  const AddTagsOnClick = (e) => {
    const trimmedInput = tagInput.trim();
    if (
      trimmedInput.length &&
      !tags.includes(trimmedInput) &&
      tags.length < 3
    ) {
      e.preventDefault();
      setTags((prevState) => [...prevState, trimmedInput]);
      setInput("");
    }
  };

  const onKeyDown = (e) => {
    const { key } = e;
    console.log(key);
    const trimmedInput = tagInput.trim();

    if (
      (key === "," || key === "Enter") &&
      trimmedInput.length &&
      !tags.includes(trimmedInput) &&
      tags.length < 3
    ) {
      e.preventDefault();
      setTags((prevState) => [...prevState, trimmedInput]);
      setInput("");
    }

    if (key === "Backspace" && !tagInput.length && tags.length && keyReleased) {
      e.preventDefault();
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();

      setTags(tagsCopy);
      setInput(poppedTag);
    }

    setKeyReleased(false);
  };

  const onKeyUp = () => {
    setKeyReleased(true);
  };

  const deleteTag = (index) => {
    setTags((prevState) => prevState.filter((tag, i) => i !== index));
  };

  const openModal = useCallback(() => {
    console.log(editor.chain().focus());
    setUrl(editor.getAttributes("link").href);
    setIsOpen(true);
  }, [editor]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setUrl("");
  }, []);

  const saveLink = useCallback(() => {
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    closeModal();
  }, [editor, url, closeModal]);

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    closeModal();
  }, [editor, closeModal]);

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);
  const addYoutubeVideo = useCallback(async () => {
    const url = prompt("Enter YouTube URL");

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("youtube").clearContent().run();
      return;
    }
    try {
      console.log(url);
      const sourceUrl = async () => {
        try {
          //const result = await getSourceUrl(url);
          return; // result;
        } catch (error) {
          console.error("Error fetching source URL:", error.message);
          throw error;
        }
      }; // Call getSourceUrl to extract the source URL
      sourceUrl()
        .then((url) => {
          editor.commands.setYoutubeVideo({
            src: url, // Pass the extracted source URL to setYoutubeVideo
            width: 320,
            height: 180,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error fetching source URL:", error.message);
      // Handle the error as needed (e.g., show an error message to the user)
    }
  }, [editor]);
  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCodeBlock().run();
  }, [editor]);
  const handleButtonClick = async () => {
    await uploadBlobImagesToFirebase();
    // Wait for images to be uploaded before replacing
    replaceBlobImages();
  };

  const isActive = (options) => {
    return editor.isActive("custom-image", options);
  };

  const setImage = (options) => {
    editor.chain().focus().setImage(options).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <>
    { !loading ? (
    <div className="pt-20 z-auto w-[100%] h-[100vh] container">
      <div
        className="hover:opacity-80 bg-white mx-auto"
        style={{
          width: "92.5%",
          height: "auto",
        }}
      >
        <h1>Ask a Question</h1>
      </div>
      <div className="w-[90%] p-8 items-center bg-white rounded-lg  sm:max-w-4xl hover:shadow-none dark:bg-gray-500">
        <p className="mr-2 text-xl text-gray-800 font-bold sm:text-2xl dark:text-gray-100">
          Add Categories👋
        </p>

        <div className="flex flex-col items-center  mt-1 text-sm sm:flex-row sm:space-y-4 sm:space-x-4">
          <div className="w-full sm:mb-2">
            <label>
              <input
                className="mt-1 mb-1 py-3 px-5 w-full border-2 border-purple-300 rounded-lg outline-none placeholder:text-gray-400 invalid:text-pink-700 invalid:focus:ring-pink-700 invalid:focus:border-pink-700 peer dark:bg-gray-500 dark:text-gray-200 dark:placeholder:text-gray-300 dark:invalid:text-pink-300 dark:border-gray-400"
                placeholder="Type something"
                value={tagInput}
                onKeyDown={onKeyDown}
                onChange={onTagChange}
                onKeyUp={onKeyUp}
                disabled={tags.length >= 3}
              />
            </label>
          </div>
          <div
            className="w-full text-center ml-2 mt-1 py-3 px-8 text-sm font-medium bg-purple-500 text-gray-100 rounded-lg cursor-pointer sm:w-auto hover:bg-purple-700 hover:text-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-50 mb-4 sm:mt-2"
            onClick={AddTagsOnClick}
          >
            <span>Add</span>
          </div>
        </div>
        {tags.length > 0 && (
          <div className="px-2 py-2 pb-11 mb-3 flex flex-wrap rounded-lg bg-purple-200 dark:bg-gray-400">
            {tags.map((tag, index) => (
              <button
                key={index}
                onClick={() => deleteTag(index)}
                className="flex flex-wrap pl-4 pr-2 py-2 m-1 justify-between items-center text-sm font-medium rounded-lg cursor-pointer bg-purple-500 text-gray-200 hover:bg-purple-600 hover:text-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                {tag}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-3 hover:text-gray-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="editor editor-mini">
        <BubbleMenu
          pluginKey="bubbleMenuText"
          className="bubble-menu-dark"
          tippyOptions={{ duration: 150 }}
          editor={editor}
          shouldShow={({ editor, view, state, oldState, from, to }) => {
            // only show if range is selected.
            return from !== to && !editor.isActive("custom-image") && !editor.isActive('title');
          }}
        >
          <button
            className="menu-button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Icons.RotateLeft />
          </button>
          <button
            className="menu-button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Icons.RotateRight />
          </button>
          <button
            className={classNames("menu-button", {
              "is-active": editor.isActive("link"),
            })}
            onClick={openModal}
          >
            <Icons.Link />
          </button>
          <button
            className={classNames("menu-button", {
              "is-active": editor.isActive("bold"),
            })}
            onClick={toggleBold}
          >
            <Icons.Bold />
          </button>
          <button
            className={classNames("menu-button", {
              "is-active": editor.isActive("underline"),
            })}
            onClick={toggleUnderline}
          >
            <Icons.Underline />
          </button>
          <button
            className={classNames("menu-button", {
              "is-active": editor.isActive("intalic"),
            })}
            onClick={toggleItalic}
          >
            <Icons.Italic />
          </button>
          <button
            className={classNames("menu-button", {
              "is-active": editor.isActive("strike"),
            })}
            onClick={toggleStrike}
          >
            <Icons.Strikethrough />
          </button>
          <button
            className={classNames("menu-button", {
              "is-active": editor.isActive("code"),
            })}
            onClick={toggleCode}
          >
            <Icons.Code />
          </button>
        </BubbleMenu>
        <BubbleMenu
          className="bubble-menu-dark"
          tippyOptions={{ duration: 150 }}
          editor={editor}
          shouldShow={({ editor, view, state, oldState, from, to }) => {
            // only show the bubble menu for images and links
            return (
              editor.isActive("custom-image") ||
              editor.isActive("custom-image-small") ||
              editor.isActive("custom-image-large") ||
              editor.isActive("custom-image-medium")
            );
          }}
        >
          <button
            className={`button ${
              isActive({ size: "medium" }) ? "is-active" : ""
            }`}
            onClick={() => setImage({ size: "medium" })}
          >
            Medium
          </button>
          <button
            className={`button ${isActive({ size: "small" }) ? "is-active" : ""}`}
            onClick={() => setImage({ size: "small" })}
          >
            Small
          </button>
          <button
            className={`button ${isActive({ size: "large" }) ? "is-active" : ""}`}
            onClick={() => setImage({ size: "large" })}
          >
            Large
          </button>

          <button
            className={`button ${isActive({ float: "left" }) ? "is-active" : ""}`}
            onClick={() => setImage({ float: "left" })}
          >
            Left
          </button>
          <button
            className={`button ${isActive({ float: "none" }) ? "is-active" : ""}`}
            onClick={() => setImage({ float: "none" })}
          >
            No Float
          </button>
          <button
            className={`button ${
              isActive({ float: "right" }) ? "is-active" : ""
            }`}
            onClick={() => setImage({ float: "right" })}
          >
            Right
          </button>
        </BubbleMenu>
        <div
          onClick={() => {
            editor?.chain().focus().run();
          }}
        >
          {editor && <BubbleMenu editor={editor} />}
          {editor?.isActive("image")}
          <EditorContent editor={editor} />
          <div className="character-count">
        {editor.storage.characterCount.characters()}/{2000} characters
        <br />
        {editor.storage.characterCount.words()} words
      </div>
        </div>

        <BubbleMenu
          pluginKey="bubbleMenuLink"
          className="bubble-menu-dark"
          tippyOptions={{ duration: 150 }}
          editor={editor}
          shouldShow={({ editor, view, state, oldState, from, to }) => {
            // only show the bubble menu for links.
            return from === to && editor.isActive("link");
          }}
        >
          <button className="button" onClick={openModal}>
            Edit
          </button>
          <button className="button-remove" onClick={removeLink}>
            Remove
          </button>
        </BubbleMenu>

        <EditorContent editor={editor} />

        <LinkModal
          url={url}
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Link Modal"
          closeModal={closeModal}
          onChangeUrl={(e) => setUrl(e.target.value)}
          onSaveLink={saveLink}
          onRemoveLink={removeLink}
        />
        <button className="button" onClick={handlePublish}>
          <Icons.Publish />
          <h4>Publish</h4>
        </button>
      </div>
    </div>
    ):(
      <div className="pt-20 w-[100%] h-[100vh] container">
        <PostLoader/>
      </div>
    )}
    </>
  );
};
export default DoubtStoreEditor;
