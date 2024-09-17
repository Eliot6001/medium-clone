
import React from 'react'
import { type Editor } from '@tiptap/react'
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import './styles.scss'
type ToolbarProps = {
  editor: Editor | null
}

const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) return null

  return (
    <div className="flex space-x-2 p-2 bg-gray-100 rounded-lg">
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
        pressed={editor.isActive('bold')}
        onPressedChange={() => {
          editor.chain().focus().toggleBold().run()
        }}
        className="p-2"
      >
        <Bold size={16} />
      </Toggle>

      <Toggle
        pressed={editor.isActive('italic')}
        onPressedChange={() => {
          editor.chain().focus().toggleItalic().run()
        }}
        className="p-2"
      >
        <Italic size={16} />
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

