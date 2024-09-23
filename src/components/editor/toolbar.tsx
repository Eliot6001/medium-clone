
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
  Code,
  ArrowUp,
  ArrowDown,
  AArrowDown,
  AArrowUp,
  UndoIcon,
  Redo
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import './styles.scss'
import { number } from 'zod'
import { Input } from '../ui/input'
type ToolbarProps = {
  editor: Editor | null
}

const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) return null
  const toggleClassName = `bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 transition-all duration-150
`
  const setLink = React.useCallback(() => {
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

  return (
    <div className="flex space-x-2 p-2 bg-gray-100 rounded-t-lg apply-colors-primary">
      <Toggle
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }}
        className={editor.isActive('heading', { level: 2 }) ? `${toggleClassName} is-active` : ''}
      >
        <Heading2 size={16} />
      </Toggle>

      <Toggle
        pressed={editor.isActive('bold')}
        onPressedChange={() => {
          editor.chain().focus().toggleBold().run()
        }}
        className={editor.isActive('bold') ? `${toggleClassName} is-active` : ''}
      >
        <Bold size={16} />
      </Toggle>

      <Toggle
        pressed={editor.isActive('italic')}
        onPressedChange={() => {
          editor.chain().focus().toggleItalic().run()
        }}
        className={editor.isActive('italic') ? `${toggleClassName} is-active` : ''}
      >
        <Italic size={16} />
      </Toggle>

      <Toggle
        pressed={editor.isActive('underline')}
        onPressedChange={() => {
          editor.chain().focus().toggleUnderline().run()
        }}
        className={editor.isActive('underline') ? `${toggleClassName} is-active` : ''}
      >
        <Underline size={16} />
      </Toggle>

      <Toggle
        pressed={editor.isActive('strike')}
        onPressedChange={() => {
          editor.chain().focus().toggleStrike().run()
        }}
        className={editor.isActive('strike') ? `${toggleClassName} is-active` : ''}
      >
        <Strikethrough size={16} />
      </Toggle>

      <Toggle
        onClick={setLink}
        className={editor.isActive('link') ? `${toggleClassName} is-active` : ''}
      >
        <Link size={16} />
      </Toggle>


      <Toggle
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => {
          editor.chain().focus().toggleBulletList().run()
        }}
        className={editor.isActive('bulletList') ? `${toggleClassName} is-active` : ''}
      >
        <List size={16} />
      </Toggle>

      <Toggle
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => {
          editor.chain().focus().toggleOrderedList().run()
        }}
        className={editor.isActive('orderedList') ? `${toggleClassName} is-active` : ''}
      >
        <ListOrdered size={16} />
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? `${toggleClassName} is-active` : ''}
      >
        <Code size={16} />
      </Toggle>

      <Toggle
        className={`${toggleClassName}`}
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <UndoIcon size={16} />
      </Toggle>

      <Toggle
        onClick={() => editor.chain().focus().redo().run()}
        className={`${toggleClassName}`}
        disabled={!editor.can().redo()}
      >
        <Redo size={16} />
      </Toggle >
    </div >
  )
}

export default Toolbar

