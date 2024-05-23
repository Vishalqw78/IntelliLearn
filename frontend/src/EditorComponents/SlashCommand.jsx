import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
  useLayoutEffect,
} from "react";

import axios from "axios";

import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Image,
  Text,
} from "lucide-react";
import ReactDOM, { createPortal } from "react-dom";
import PropTypes from "prop-types";

const Command = Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
async function getSourceUrl(url) {
  try {
    // NoEmbed API endpoint
    const noembedApiUrl = `https://noembed.com/embed?url=${encodeURIComponent(
      url
    )}`;

    // Send an HTTP GET request to NoEmbed using Axios
    const response = await axios.get(noembedApiUrl);

    // Check if the response status is OK (status code 200)
    if (response.status !== 200) {
      throw new Error(
        `Request to NoEmbed failed with status code ${response.status}`
      );
    }

    // Access the source URL (src)
    const srcUrl = response.data;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = response.data.html;

    // Extract the 'src' attribute from the 'iframe'
    const iframeSrc = tempDiv.querySelector("iframe").getAttribute("src");

    console.log(iframeSrc);

    if (iframeSrc) {
      return iframeSrc;
    } else {
      throw new Error("Source URL not found in the response.");
    }
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

const GifModal = ({ gifs, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      isMounted = false;
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [onClose]);

  useEffect(() => {
    let isMounted = true;

    if (searchTerm !== "") {
      setIsLoading(true);
      axios
        .get(
          `https://api.giphy.com/v1/gifs/search?api_key=pMo8LBgASaMilQP0lTMMQliZbRnpEBKD&q=${searchTerm}&limit=10`
        )
        .then((response) => {
          const gifs = response.data.data;
          if (isMounted) {
            setSearchResults(gifs);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching GIFs:", error);
        });
    } else {
      setSearchResults(gifs);
    }

    return () => {
      isMounted = false;
    };
  }, [searchTerm, gifs]);

  const handleGifClick = (gif) => {
    onSelect(gif);
    onClose();
  };

  return (
    <div className="gif-modal" ref={modalRef}>
      <div className="search-container PickerBlock">
        <input
          type="text"
          placeholder="Search for a GIF"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={onClose}>Close</button>
      </div>
      <div className="gif-list">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          searchResults.map((gif, index) => (
            <div
              key={index}
              className="gif-item"
              onClick={() => handleGifClick(gif)}
            >
              <img
                src={gif.images.fixed_height.url}
                alt={gif.title}
                onLoad={() => {
                  if (index === searchResults.length - 1) {
                    setIsLoading(false);
                  }
                }}
              />
            </div>
          ))
        )}
      </div>
      <div className="modal-footer">Powered By GIF</div>
    </div>
  );
};

const InputModal = ({ isOpen, onClose, onInputSubmit }) => {
  const [inputText, setInputText] = useState("");
  const modalRef = useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleCancel = () => {
    setInputText("");
    onClose();
  };

  const handleSubmit = () => {
    onInputSubmit(inputText);
    setInputText("");
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  useEffect(() => {
    let isMounted = true;

    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      isMounted = false;
      if (isOpen) {
        document.removeEventListener("click", handleOutsideClick);
      }
    };
  }, [isOpen, onClose]);

  return (
    <div className={`input-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content" ref={modalRef}>
        <h2>Paste Media Link</h2>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Added keydown event handler
          placeholder="Paste a YouTube, Vine, Vimeo, or other media link, and press Enter"
        />
        <div className="button-container">
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

const getSuggestionItems = ({ query }) => {
  return [
    {
      title: "Heading 1",
      description: "Big section heading.",
      icon: <Heading1 size={18} />,
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: "Heading 2",
      description: "Medium section heading.",
      icon: <Heading2 size={18} />,
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: "Heading 3",
      description: "Small section heading.",
      icon: <Heading3 size={18} />,
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      },
    },
    {
      title: "Insert Image",
      description: "Image.",
      icon: <Image size={18} />,
      command: ({ editor, range }) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.addEventListener("change", (e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            if (imageUrl) {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setImage({ src: imageUrl })
                .run(); // Insert the selected image
            }
          }
        });
        fileInput.click();
      },
    },
    {
      title: "Insert GIF",
      description: "GIF",
      icon: <Image size={18} />,
      command: async ({ editor, range }) => {
        try {
          const apiKey = "pMo8LBgASaMilQP0lTMMQliZbRnpEBKD"; // Replace with your Giphy API key
          const modalContainer = document.querySelector(".gif-modal-container");

          // Function to close the modal
          function closeModal() {
            const modalContainer = document.querySelector(
              ".gif-modal-container"
            );
            if (modalContainer) {
              ReactDOM.unmountComponentAtNode(modalContainer);
              modalContainer.remove();
            }
          }

          if (!modalContainer) {
            // Create a modal container only if it doesn't exist
            const newModalContainer = document.createElement("div");
            newModalContainer.classList.add("gif-modal-container"); // Apply the modal container styles

            // Render the modal
            ReactDOM.render(
              <GifModal
                gifs={[]} // Start with an empty array
                onSelect={(selectedGif) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setImage({ src: selectedGif.images.original.url })
                    .run();
                  closeModal();
                }}
                onClose={closeModal}
              />,
              newModalContainer
            );

            // Append the modal container to the document body
            document.body.appendChild(newModalContainer);
          }
        } catch (error) {
          console.error("Error inserting GIF:", error);
          alert("An error occurred while inserting the GIF.");
        }
      },
    },
    {
      title: "Insert Video",
      description: "Video",
      icon: <Image size={18} />,
      command: async ({ editor, range }) => {
        try {
          const modalContainer = document.querySelector(
            ".input-modal-container"
          );

          // Function to close the modal
          function closeModal() {
            const modalContainer = document.querySelector(
              ".input-modal-container"
            );
            if (modalContainer) {
              ReactDOM.unmountComponentAtNode(modalContainer);
              modalContainer.remove();
            }
          }

          if (!modalContainer) {
            // Create a modal container only if it doesn't exist
            const newModalContainer = document.createElement("div");
            newModalContainer.classList.add("input-modal-container"); // Apply the modal container styles

            // Render the modal
            ReactDOM.render(
              <InputModal
                isOpen={true} // Open the modal by default
                onClose={closeModal}
                onInputSubmit={async (inputText) => {
                  try {
                    // Fetch the source URL using the input text
                    const url = await getSourceUrl(inputText);

                    // Set the YouTube video in the Tiptap editor
                    editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .setYoutubeVideo({ src: url, width: 610, height: 305 })
                      .run();

                    closeModal(); // Close the modal
                  } catch (error) {
                    console.error("Error inserting input:", error);
                    alert("An error occurred while inserting the input.");
                  }
                }}
              />,
              newModalContainer
            );

            // Append the modal container to the document body
            document.body.appendChild(newModalContainer);
          }
        } catch (error) {
          console.error("Error inserting input:", error);
          alert("An error occurred while inserting the input.");
        }
      },
    },

    {
      title: "Text",
      description: "Just start typing with plain text.",
      icon: <Text size={18} />,
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .run();
      },
    },
    {
      title: "Bold",
      description: "Make text bold.",
      icon: <Bold size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setMark("bold").run();
      },
    },
    {
      title: "Italic",
      description: "Make text italic.",
      icon: <Italic size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setMark("italic").run();
      },
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list.",
      icon: <List size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: "Numbered List",
      description: "Create a list with numbering.",
      icon: <ListOrdered size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
  ].filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      return item.title.toLowerCase().includes(query.toLowerCase());
    }
    return true;
  });
  // .slice(0, 10);
};

export const updateScrollView = (container, item) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};

const CommandList = ({ items, command }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const commandListContainer = useRef(null);
  const selectedButtonRef = useRef(null);

  const selectItem = useCallback(
    (index) => {
      const item = items[index];
      if (item) {
        command(item);
      }
    },
    [command, items]
  );

  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [items, selectedIndex, setSelectedIndex, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useEffect(() => {
    const container = commandListContainer.current;
    const item = selectedButtonRef.current;

    if (item && container) {
      container.scrollTop = item.offsetTop - container.offsetTop;

      item.focus();
    }

    if (selectedIndex === 0 && items.length > 0) {
      setTimeout(() => {
        selectedButtonRef.current?.focus();
      }, 10);
    }
  }, [selectedIndex, items]);

  return items.length > 0 ? (
    <div ref={commandListContainer} className="scroll-container">
      {items.map((item, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            ref={isSelected ? selectedButtonRef : null}
            className={`scroll-inside-button ${
              isSelected ? `scroll-is-selected` : ""
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="scroll-icon">{item.icon}</div>
            <div className="margin1">
              <p className="">{item.title}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  ) : null;
};

const renderItems = () => {
  let component;
  let popup;

  return {
    onStart: (props) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },
    onUpdate: (props) => {
      component?.updateProps(props);

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
    },
    onKeyDown: (props) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide();

        return true;
      }

      return component?.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

const SlashCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems,
  },
});

export { SlashCommand };
