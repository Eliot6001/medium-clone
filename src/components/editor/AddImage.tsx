

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { EditorContent, Editor } from '@tiptap/react';
import './styles.scss';

const AddImage = ({ editor }: { editor: Editor | null }) => {
  const [isDragging, setIsDragging] = useState(false);
  const draggedFiles = useRef<Set<string>>(new Set()); // Track files being dragged
const handleImageInsertion = useCallback((file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result;
    if (typeof result === 'string' && editor) {
      // Ensure the result is a valid base64 string
      const base64Data = result.split(',')[1];
      const mimeType = file.type;
      if (base64Data) {
        // Convert base64 string to binary data
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob from the binary data
        const blob = new Blob([byteArray], { type: mimeType });
        const url = URL.createObjectURL(blob);

        // Insert the image into the editor
        const { state } = editor;
        const { selection } = state;
        const position = selection.$head.pos;
        editor.chain().insertContentAt(position, {
          type: 'image',
          attrs: { src: url }
        }).run();

        // Revoke the object URL after use
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 10000); // Adjust timeout as needed
      }
    }
  };
  reader.readAsDataURL(file);

}, [editor]);  


  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          handleImageInsertion(file);
        }
      });
    }
  }, [handleImageInsertion]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);  useEffect(() => {
    if (editor) {
      const editorElement = document.querySelector('.ProseMirror');
      if (editorElement) {
        editorElement.addEventListener('drop', handleDrop as any);
        editorElement.addEventListener('dragover', handleDragOver as any);
        editorElement.addEventListener('dragleave', handleDragLeave as any);
      }

      return () => {
        if (editorElement) {
          editorElement.removeEventListener('drop', handleDrop as any);
          editorElement.removeEventListener('dragover', handleDragOver as any);
          editorElement.removeEventListener('dragleave', handleDragLeave as any);
        }
      };
    }
  }, [editor, handleDrop, handleDragOver, handleDragLeave]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`editor-wrapper bg-black ${isDragging ? 'dragging' : ''}`}>
    </div>
  );
};

export default AddImage;

