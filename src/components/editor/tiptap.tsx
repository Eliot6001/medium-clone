// src/Tiptap.tsx
import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './toolbar'
import Image from '@tiptap/extension-image'
import AddImage from './AddImage'
// define your extension array
const extensions = [StarterKit]


const Tiptap = ({
  onChange,
  description
}: {
  description: string,
  onChange: (text: string) => void
}) => {
  const editor = useEditor({
    extensions: [StarterKit.configure(), Image],
    content: description,
    editorProps:{
      attributes:{
        class: "min-h-[80px] w-full rounded-md border bg-white p-3 focus-visible:outline-none"      }
    },
    onUpdate({editor}){
      onChange(editor.getHTML()),
      console.log(editor.getHTML())
    }
  })

  return (
    <>
        <Toolbar editor={editor}/>
      <AddImage editor={editor}/>
      <EditorContent editor={editor} />
    </>
  )
}

export default Tiptap

