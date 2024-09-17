
import './styles.scss'

import { EditorContent } from '@tiptap/react'
import { useCallback } from 'react'
import { type Editor } from '@tiptap/react'

const AddImage = ({ editor }: { editor: Editor | null }) => {

  if (!editor) {
    return null
  }

  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])


  return (
    <>
      <div className="control-group">
        <div className="button-group">
          <button onClick={addImage}>Set image</button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </>
  )
}

export default AddImage
