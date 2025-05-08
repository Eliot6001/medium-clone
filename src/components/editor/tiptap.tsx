// src/Tiptap.tsx
import {
  useEditor,
  EditorContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./toolbar";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import AddImage from "./AddImage";
import Underline from "@tiptap/extension-underline";
import { cn } from "@/lib/utils";


// define your extension array
const extensions = [
  StarterKit.configure({
    heading: {
      levels: [2],
    },
  }),
  Image.configure({
    allowBase64: true,
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
  }),
  
];

const Tiptap = ({
  onChange,
  description,
  setUploadImage,
}: {
  description: string;
  onChange: (text: string) => void;
  setUploadImage: (uploading: boolean) => void;
}) => {

  const editor = useEditor({
    extensions: extensions,
    content: description,
    editorProps: {
      attributes: {
        class: cn(
          "editor-wrapper w-full rounded-md border bg-white p-3 h-full min-h-full ",
          "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 transition-all duration-150"
        ),
        spellcheck: "true",
      },
    },
    onUpdate(evt) {
      onChange(evt.editor.getHTML());
      console.log(evt.editor.getHTML());

      const { selection } = evt.editor.state;

      if (!selection.empty) {
        // Do not scroll into view when we're doing a mass update (e.g. underlining text)
        // We only want the scrolling to happen during actual user input
        return;
      }

      const viewportCoords = evt.editor.view.coordsAtPos(selection.from);
      const absoluteOffset = window.scrollY + viewportCoords.top;

      window.scrollTo(window.scrollX, absoluteOffset - window.innerHeight / 2);
    },
  });

  return (
    <div className="h-full ">
      {" "}
      {/* Make sure the wrapper is h-full */}
      <Toolbar editor={editor} className="sticky top-0 shadow-md z-20" />
      <div className="editor-wrapper overflow-y-scroll no-scrollbar ">
        {" "}
        {/* Scroll here */}
        <AddImage editor={editor}  setUploadingImage={setUploadImage} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Tiptap ;
