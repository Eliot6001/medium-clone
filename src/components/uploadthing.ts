import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
  type GenerateTypedHelpersOptions,
} from "@uploadthing/react";


const backendUrl = import.meta.env.VITE_BACKEND_URL;
const initOpts = {
  url: `${backendUrl}/api/uploadthing`,
} satisfies GenerateTypedHelpersOptions;

export const UploadButton = generateUploadButton(initOpts);
export const UploadDropzone = generateUploadDropzone(initOpts);

export const { useUploadThing } = generateReactHelpers(initOpts);
