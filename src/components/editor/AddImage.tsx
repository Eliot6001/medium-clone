import React, { useState, useCallback, useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";
import { useUploadThing } from "../uploadthing"; // Make sure this hook is properly configured
import "./styles.scss";


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
      const uploadFile = async (file: File) => {
        // Directly pass the file in an array to startUpload.
        const result = await startUpload([file]);
        console.log(result, "data from uploadthing");
        return result; // Expected to be an array with file info, including .url
      };
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result;
        if (typeof result === "string" && editor) {
          // Create a temporary preview from the base64 data.
          const base64Data = result.split(",")[1];
          const mimeType = file.type;
          if (base64Data) {
            // Convert base64 string to binary data and create a Blob.
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            const tempUrl = URL.createObjectURL(blob);

            // Generate a unique ID for the image node.
            const uniqueId = `upload-${Date.now()}-${Math.random()}`;

            // Insert the image with the temporary URL and a custom attribute for identification.
            const { state } = editor;
            const { selection } = state;
            const position = selection.$head.pos;
            editor
              .chain()
              .insertContentAt(position, {
                type: "image",
                attrs: { src: tempUrl, "data-upload-id": uniqueId },
              })
              .run();
           
            // Now trigger the actual upload.
            try {
              const uploadResult = await uploadFile(file);
              const uploadedUrl = uploadResult?.[0]?.ufsUrl ?? "";
              if (uploadedUrl) {
                // Update the image in the editor by matching the unique attribute.
                editor.commands.updateAttributes("image", {
                  src: uploadedUrl,
                  "data-upload-id": uniqueId,
                });
              }
            } catch (error) {
              console.error("Upload failed:", error);
              // Optionally, remove the temporary image or notify the user.
            }
            finally{
              setUploadingImage(false);
            }

            // Clean up the temporary URL after a delay.
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
      if (editorElement) {
        editorElement.addEventListener("drop", handleDrop as DragEventListener);
        editorElement.addEventListener(
          "dragover",
          handleDragOver as DragEventListener
        );
        editorElement.addEventListener(
          "dragleave",
          handleDragLeave as DragEventListener
        );
      }
      return () => {
        if (editorElement) {
          editorElement.removeEventListener("drop", handleDrop as any);
          editorElement.removeEventListener("dragover", handleDragOver as any);
          editorElement.removeEventListener(
            "dragleave",
            handleDragLeave as any
          );
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
