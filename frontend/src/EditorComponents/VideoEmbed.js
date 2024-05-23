import { Node, mergeAttributes } from "@tiptap/core";
import "./dd.css";
const Video = Node.create({
  name: "video", // unique name for the Node
  group: "block", // belongs to the 'block' group of extensions
  selectable: true, // so we can select the video
  draggable: true, // so we can drag the video
  atom: true, // is a single unit

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video",
      },
      {
        tag: "figcaption",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ editor, node }) => {
      const div = document.createElement("div");
      div.className =
        "aspect-16-9" + (editor.isEditable ? " cursor-pointer" : "");
      const iframe = document.createElement("iframe");
      if (editor.isEditable) {
        iframe.className = "pointer-events-none";
      }
      iframe.width = "640";
      iframe.height = "360";
      iframe.frameborder = "0";
      iframe.allowfullscreen = "";
      iframe.src = node.attrs.src;
      div.append(iframe);
      return {
        dom: div,
      };
    };
  },
});

export { Video };
