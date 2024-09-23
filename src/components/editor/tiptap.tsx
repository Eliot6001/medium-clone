// src/Tiptap.tsx
import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './toolbar'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import AddImage from './AddImage'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Bold from '@tiptap/extension-bold'
import { cn } from '@/lib/utils'
import Text from '@tiptap/extension-text'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Italic from '@tiptap/extension-italic'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import CodeBlock from '@tiptap/extension-code-block'
// define your extension array
const extensions = [StarterKit.configure(), Image.configure({
  allowBase64: true,
}), 
Link.configure({
  openOnClick: false,
  autolink: true,
  defaultProtocol: 'https',
}), Bold, Text, Document, Paragraph, Italic, Underline, Strike, BulletList, OrderedList, CodeBlock,  Text]

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
        class: cn('min-h-[20rem] max-h-[20rem] overflow-y-auto w-full rounded-md border bg-white p-3 ',
          'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 transition-all duration-150'),
        spellcheck: 'false',
      }
    },
    onUpdate(evt) {
      onChange(evt.editor.getHTML())
      console.log(evt.editor.getHTML())
      console.log(evt.editor.getJSON())
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
      <div className="editor-wrapper h-80 space-y-6 "> 
        <AddImage editor={editor} />
        <EditorContent editor={editor}  className=""/>
      </div>
    </div>)
}

export default Tiptap

