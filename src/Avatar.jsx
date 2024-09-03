import { Input } from './components/ui/input'
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useToast } from "@/components/ui/use-toast"

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [animate, setAnimate] = useState(false);

  const { toast } = useToast()

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);

      setAvatarUrl(url);
      setAnimate(true);

    } catch (error) {
      toast({
        variant: 'destructive',
        description: "There has been an issue at uploading your image!",
        duration: 1500
      })
    }
  }

  async function uploadAvatar(event) {
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

  return (
    <div className="flex flex-col items-center space-y-4">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full shadow-lg"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center"
          style={{ height: size, width: size }}
        >
          <span className="text-gray-500 dark:text-gray-400">No Image</span>
        </div>
      )}
      <div className="w-full flex justify-center">
        <label className={`button primary block cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`} htmlFor="single">
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
    </div>
  );
}

