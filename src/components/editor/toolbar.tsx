
import React from 'react'
import { type Editor } from '@tiptap/react'
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Link,

} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import './styles.scss'
import { cn } from '@/lib/utils'
type ToolbarProps = {
  editor: Editor | null;
  className?:string;
}

const Toolbar = ({ editor, className }: ToolbarProps) => {

  const setLink = React.useCallback(() => {
    if (!editor) return null
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])
  if (!editor) return null

  return (
    <div className={cn("flex space-x-2 p-2 bg-gray-100 rounded-lg apply-colors-primary ", className)}>
      <Toggle
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }}
        className="p-2"
      >
        <Heading2 size={16} />
      </Toggle>

      <Toggle
          className={cn("p-2", editor.isActive('bold') ? 'is-active' : 'p')}
          onPressedChange={() => {
          editor.chain().focus().toggleBold().run()
        }}
        >
        <Bold size={16} />
      </Toggle>

      <Toggle
          className={cn("p-2", editor.isActive('italic') ? 'is-active' : 'p')}
          onPressedChange={() => {
          editor.chain().focus().toggleItalic().run()
        }}
      >
        <Italic size={16} />
      </Toggle>
      <Toggle
        pressed={editor.isActive('underline')}
        onPressedChange={() => {
          editor.chain().focus().toggleUnderline().run()
        }}
        className="p-2"
      >
        <Underline size={16} />
      </Toggle>
      <Toggle
        pressed={editor.isActive('strike')}
        onPressedChange={() => {
          editor.chain().focus().toggleStrike().run()
        }}
        className="p-2"
      >
        <Strikethrough size={16} />
      </Toggle>

      <Toggle
        onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''} >
        <Link size={16} />
      </Toggle>


      <Toggle
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => {
          editor.chain().focus().toggleBulletList().run()
        }}
        className="p-2"
      >
        <List size={16} />
      </Toggle>

      <Toggle
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => {
          editor.chain().focus().toggleOrderedList().run()
        }}
        className="p-2"
      >
        <ListOrdered size={16} />
      </Toggle>
    </div>
  )
}

export default Toolbar

