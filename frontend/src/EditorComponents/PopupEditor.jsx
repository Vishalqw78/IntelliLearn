import { useCallback, useState } from "react";
import classNames from "classnames";
import ImageExtended from "./ImageExtended.jsx";

import { Video } from "./VideoEmbed.js";
import { storage } from "./firebase.js";
import { TextAlign } from "@tiptap/extension-text-align";

//import Youtube from "@tiptap/extension-youtube";
import Youtube from "./youtube/index.js";
import Heading from "@tiptap/extension-heading";
import { useEditor, EditorContent } from "@tiptap/react";
import CustomKeymap from "./custom-keymap.js";
import DragAndDrop from "./drag-and-drop.jsx";

import Underline from "@tiptap/extension-underline";

import "./styles.css";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";

export function PopupEditor({editorc}) {
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

      Image.configure({
        HTMLAttributes: {
          class: 'custom-image-small custom-image-float-none resizable',
        },
      }),
      Video,
      Youtube.configure({
        inline: false,
        HTMLAttributes: {
          class: "ytvariable",
        },
      }),
    ],
    editable:false,
    content:editorc
  });
  


  return (
    <div className="editor editor-mini">
      

      <EditorContent editor={editor} />

      
    </div>
  );
}
