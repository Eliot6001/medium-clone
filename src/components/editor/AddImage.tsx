import React, { useState, useCallback, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { useUploadThing } from "../uploadthing"; // Make sure this hook is properly configured
import "./styles.scss";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 second

type AddImageProps = {
  editor: Editor | null;
  setUploadingImage: (uploading: boolean) => void;
}
const AddImage = ({ editor, setUploadingImage }: AddImageProps) => {
  const [isDragging, setIsDragging] = useState(false);

  // Assume useUploadThing returns an imperative function to start an upload.
  const { startUpload } = useUploadThing("articleMedia", {
    onClientUploadComplete: (result) => {
      console.log("Upload Completed", result);
    },
  });

  const handleImageInsertion = useCallback(
    async (file: File) => {
      setUploadingImage(true); // Mark upload as started

      // Function to trigger file upload using UploadThing.
      const uploadFile = async (file: File, retries = 0): Promise<unknown> => {
        try {
          const result = await startUpload([file]);
          console.log(result, "data from uploadthing");
          return result;
        } catch (error) {
          console.error(`Upload attempt ${retries + 1} failed`, error);
          if (retries < MAX_RETRIES) {
            console.log(`Retrying upload in ${RETRY_DELAY}ms...`);
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            return uploadFile(file, retries + 1);
          }
          throw new Error("Max retries reached.");
        }
      };
    const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result;
        if (typeof result === "string" && editor) {
          const base64Data = result.split(",")[1];
          const mimeType = file.type;
          if (base64Data) {
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            const tempUrl = URL.createObjectURL(blob);

            const uniqueId = `upload-${Date.now()}-${Math.random()}`;
            const { state } = editor;
            const { selection } = state;
            const position = selection.$head.pos;
            editor.chain().insertContentAt(position, {
              type: "image",
              attrs: { src: tempUrl, "data-upload-id": uniqueId },
            }).run();

            try {
              const uploadResult = await uploadFile(file);
              const uploadedUrl = uploadResult?.[0]?.ufsUrl ?? "";
              if (uploadedUrl) {
                editor.commands.updateAttributes("image", {
                  src: uploadedUrl,
                  "data-upload-id": uniqueId,
                });
              }
            } catch (error) {
              console.error("Final upload failed after retries:", error);
            } finally {
              setUploadingImage(false);
            }

            setTimeout(() => {
              URL.revokeObjectURL(tempUrl);
            }, 10000);
          }
        }
      };
      reader.readAsDataURL(file);
    },
    [editor, setUploadingImage,startUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        Array.from(e.dataTransfer.files).forEach((file) => {
          if (file.type.startsWith("image/")) {
            handleImageInsertion(file);
          }
        });
      }
    },
    [handleImageInsertion]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (editor) {
      const editorElement = document.querySelector(".ProseMirror");
      // Helper to convert React drag event handlers to native event listeners
      const dropListener = (e: Event) => handleDrop(e as unknown as React.DragEvent<HTMLDivElement>);
      const dragOverListener = (e: Event) => handleDragOver(e as unknown as React.DragEvent<HTMLDivElement>);
      const dragLeaveListener = (e: Event) => handleDragLeave(e as unknown as React.DragEvent<HTMLDivElement>);
      if (editorElement) {
        editorElement.addEventListener("drop", dropListener as EventListener);
        editorElement.addEventListener("dragover", dragOverListener as EventListener);
        editorElement.addEventListener("dragleave", dragLeaveListener as EventListener);
      }
      return () => {
        if (editorElement) {
          editorElement.removeEventListener("drop", dropListener as EventListener);
          editorElement.removeEventListener("dragover", dragOverListener as EventListener);
          editorElement.removeEventListener("dragleave", dragLeaveListener as EventListener);
        }
      };
    }
  }, [editor, handleDrop, handleDragOver, handleDragLeave]);

  if (!editor) return null;

  return (
    <div className={`editor-wrapper bg-black ${isDragging ? "dragging" : ""}`}>
      {/* The UploadThing UI is hidden; uploads are handled programmatically */}
    </div>
  );
};

export default AddImage;
