// src/Tiptap.tsx
import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './toolbar'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import AddImage from './AddImage'
import Underline from '@tiptap/extension-underline'
import { cn } from '@/lib/utils'
import { ScrollRestoration } from 'react-router-dom'

// define your extension array
const extensions = [StarterKit.configure(), Image.configure({
  allowBase64: true,
}), Underline,
Link.configure({
  openOnClick: false,
  autolink: true,
  defaultProtocol: 'https',
})]

const Tiptap = ({
  onChange,
  description
}: {
  description: string,
  onChange: (text: string) => void
}) => {

  const editor = useEditor({
    extensions: extensions,
    content: description,
    editorProps: {
      attributes: {
        class: cn('editor-wrapper w-full rounded-md border bg-white p-3 ',
          'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 transition-all duration-150'),
        spellcheck: 'false',
      }
    },
    onUpdate(evt) {
      onChange(evt.editor.getHTML())
      const { selection } = evt.editor.state;

      if (!selection.empty) {
        // Do not scroll into view when we're doing a mass update (e.g. underlining text)
        // We only want the scrolling to happen during actual user input
        return;
      }

      const viewportCoords = evt.editor.view.coordsAtPos(selection.from);
      const absoluteOffset = window.scrollY + viewportCoords.top;

      window.scrollTo(
        window.scrollX,
        absoluteOffset - (window.innerHeight / 2),
      );
    },
  })

  return (
    <div className="h-full "> {/* Make sure the wrapper is h-full */}
      <Toolbar editor={editor} />
      <div className="editor-wrapper h-80 overflow-y-scroll"> {/* Scroll here */}
        <AddImage editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>)
}

export default Tiptap

