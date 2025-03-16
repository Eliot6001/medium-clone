import { Input } from './components/ui/input'
import { useEffect, useCallback, useState } from 'react';
import { supabase } from './supabaseClient';
import { useToast } from "@/components/ui/use-toast"
import { cn } from './lib/utils'
import { useLocalStorage } from './hooks/useLocalStorage';

function createBlobUrlFromBase64(base64) {
  try {
    const [header, base64Data] = base64.split(',');
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: header.split(':')[1].split(';')[0] });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error creating Blob URL from base64:', error);
    return null;
  }
}


export default function Avatar({ url, size, onUpload, onPublicRoute = false, className }) {

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [tempURL, settempURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const { toast } = useToast()

  const [cachedAvatars, setCachedAvatars] = useLocalStorage('cachedAvatars', {});

  useEffect(() => {
    if (url) downloadImage(url);
    return () => {
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
    }
  }, [url, cachedAvatars]);


  const downloadImage = useCallback(async (path) => {
    try {
      if (cachedAvatars[path]) {
        const imgurl = createBlobUrlFromBase64(cachedAvatars[path])
        console.log("Using cached image:", imgurl);
        settempURL(imgurl);
        setAnimate(true);
        return;
      }

      const { data, error } = await supabase.storage.from('avatars').download(path);
      
      if (error) {
        throw error;
      }
      else if(data){
        toast({
          variant: 'success',
          description: "Your pfp has been updated!",
          duration: 1500
        })
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64data = reader.result;
        setCachedAvatars(prev => ({
          ...prev,
          [path]: base64data
        }));
        const blobUrl = createBlobUrlFromBase64(base64data);
        console.log("Created new Blob URL:", blobUrl);
        settempURL(blobUrl);
        setAnimate(true);
        setRenderKey(prev => prev + 1);  // Force re-render
      };
      reader.readAsDataURL(data);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast({
        variant: 'destructive',
        description: "There has been an issue downloading your image!",
        duration: 1500
      })
    }
  }, [cachedAvatars, createBlobUrlFromBase64, setCachedAvatars]);

  async function uploadAvatar(event) {
    if (onPublicRoute) return;
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        toast({
          variant: 'destructive',
          description: 'You need to select a file!'
        })
        throw Error("File not selected!")
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(event, filePath);
    } catch (error) {
      toast({
        variant: 'destructive',
        description: `Error uploading file: ${error.message || 'Unknown error'}`,
        duration: 2500
      })
    } finally {
      setUploading(false);
    }
  }

  const checkBlobUrl = useCallback(async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      console.log("Blob size:", blob.size, "Blob type:", blob.type);
      return blob.size > 0;
    } catch (error) {
      console.error("Error checking Blob URL:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    if (avatarUrl && avatarUrl.startsWith('blob:')) {
      checkBlobUrl(avatarUrl).then(isValid => {
        if (!isValid) {
          console.error("Invalid Blob URL:", avatarUrl);
          setAvatarUrl(null);
        }
      });
    }
  }, [avatarUrl, checkBlobUrl]);

  return (
    <div className={"flex flex-col items-center space-y-4 "}>
      {tempURL ? (
        <span className={cn("inline-block rounded-full overflow-hidden bg-cyan-500 text-white transition-shadow duration-300 shadow-[0_0_8px_4px_rgba(0,255,255,0.4)] hover:shadow-[0_0_8px_6px_rgba(0,255,255,0.6)] focus:outline-none", className)}>
          <img
            src={tempURL}
            alt="Avatar"
            className="shadow-lg object-cover"
            style={{ height: size, width: size }}
          />
        </span>) : (
        <div
          className="rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center"
          style={{ height: size, width: size }}
        >
          <span className="text-gray-500 dark:text-gray-400">No Image</span>
        </div>
      )}
      {!onPublicRoute &&
        <div className="w-full flex justify-center">
          <label className={`button text-normal primary block cursor-pointer bg-cyan-500 text-black rounded px-4 py-2 hover:bg-cyan-600 transition-colors duration-300 focus:ring-2 focus:ring-zinc-400   ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`} htmlFor="single">
            {uploading ? 'Uploading ...' : 'Upload'}
          </label>
          <Input
            className="hidden"
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </div>
      }
    </div>
  );
}


