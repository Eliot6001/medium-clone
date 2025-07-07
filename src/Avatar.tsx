import { Input } from './components/ui/input'
import { useEffect, useCallback, useState, useRef } from 'react';
import { supabase } from './supabaseClient';
import { useToast } from "@/components/ui/use-toast"
import { cn } from './lib/utils'
import { useLocalStorage } from './hooks/useLocalStorage';
import useProfile from './hooks/useProfileData';
// Improved typings
interface AvatarProps {
  url: string | null;
  size: number;
  onUpload?: (event: React.ChangeEvent<HTMLInputElement>, filePath: string) => void;
  onPublicRoute?: boolean;
  className?: string;
}

// Helper function to create blob URLs from base64 data
function createBlobUrlFromBase64(base64: string): string | null {
  try {
    const [header, base64Data] = base64.split(',');
    if (!base64Data) return null;
    
    const byteCharacters = atob(base64Data);
    const byteArray = new Uint8Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    
    const mimeType = header.split(':')[1]?.split(';')[0] || 'image/jpeg';
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error creating Blob URL from base64:', error);
    return null;
  }
}

export default function Avatar({ url, size, onUpload, onPublicRoute = false, className }: AvatarProps) {
  // Single source of truth for the avatar display URL
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {clearCache} = useProfile();
  // Keep track of blob URLs to clean up
  const blobUrlsRef = useRef<string[]>([]);
  
  const { toast } = useToast();
  const [cachedAvatars, setCachedAvatars] = useLocalStorage<Record<string, string>>('cachedAvatars', {});
  
  // Download image with improved caching and error handling
  const downloadImage = useCallback(async (path: string) => {
    if (!path) return;
    
    // Prevent redundant downloads
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Check cache first
      if (cachedAvatars && cachedAvatars[path]) {
        const imgUrl = createBlobUrlFromBase64(cachedAvatars[path]);
        if (imgUrl) {
          blobUrlsRef.current.push(imgUrl);
          setAvatarUrl(imgUrl);
          return;
        }
      }

      // Download if not in cache
      const { data, error } = await supabase.storage.from('avatars').download(path);
      
      if (error) {
        throw error;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64data = reader.result as string;
        
        // Update cache
        setCachedAvatars(prev => ({
          ...prev,
          [path]: base64data
        }));
        
        // Create and store blob URL
        const blobUrl = createBlobUrlFromBase64(base64data);
        if (blobUrl) {
          blobUrlsRef.current.push(blobUrl);
          setAvatarUrl(blobUrl);
          clearCache();
          toast({
            variant: 'success',
            description: "Profile image updated successfully",
            duration: 1500
          });
        }
      };
      reader.readAsDataURL(data);
      
    } catch (error) {
      console.error("Error downloading image:", error);
      
    } finally {
      setIsLoading(false);
    }
  }, [cachedAvatars, setCachedAvatars, toast, isLoading, clearCache]);

  // Manage URL initialization and cleanup
  useEffect(() => {
    // Direct URL or path to download
    if (url) {
      if (!/^(blob:|https?:\/\/)/i.test(url)) {
        // It's a storage path
        downloadImage(url);
      } else {
        // It's already a URL
        setAvatarUrl(url);
      }
    } else {
      setAvatarUrl(null);
    }

    // Cleanup function to revoke all blob URLs
    return () => {
      blobUrlsRef.current.forEach(url => {
        URL.revokeObjectURL(url);
      });
      blobUrlsRef.current = [];
    };
  }, [url, downloadImage]);

  // Handle file upload
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onPublicRoute) return;
    
    try {
      setIsLoading(true);

      if (!event.target.files || event.target.files.length === 0) {
        toast({
          variant: 'destructive',
          description: 'Please select an image file'
        });
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1000)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          cacheControl: '3600', 
          upsert: false 
        });

      if (uploadError) {
        throw uploadError;
      }

      if (onUpload) {
        onUpload(event, filePath);
      }
      
    } catch (error: unknown) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: 'destructive',
        description: `Upload failed: ${message}`,
        duration: 2500
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar display with loading state */}
      {avatarUrl ? (
        <span
        className={cn(
          "inline-block rounded-full overflow-hidden bg-cyan-500 text-white",
          "transition-shadow duration-300 shadow-[0_0_8px_4px_rgba(0,255,255,0.4)]",
          "hover:shadow-[0_0_8px_6px_rgba(0,255,255,0.6)] focus:outline-none",
          isLoading && "opacity-70",
          className
        )}
        style={{ width: size, height: size }}
      >
         <img
          src={avatarUrl}
          alt="Avatar"
          className="w-full h-full object-cover"
          style={{ minWidth: size, minHeight: size, maxWidth: size, maxHeight: size }}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        </span>
      ) : (
        <div
          className={cn(
            "rounded-full bg-gray-200 dark:bg-zinc-700", 
            "flex items-center justify-center",
            isLoading && "animate-pulse",
            className
          )}
          style={{ height: size, width: size }}
        >
          <span className="text-gray-500 dark:text-gray-400">
            {isLoading ? 'Loading...' : 'No Image'}
          </span>
        </div>
      )}
      
      {/* Upload button (only shown when not on public route) */}
      {!onPublicRoute && (
        <div className="w-full flex justify-center">
          <label 
            className={cn(
              "button text-normal primary block cursor-pointer", 
              "bg-cyan-500 text-black rounded px-4 py-2", 
              "hover:bg-cyan-600 transition-colors duration-300", 
              "focus:ring-2 focus:ring-zinc-400",
              isLoading && "opacity-50 cursor-not-allowed"
            )} 
            htmlFor="avatar-upload"
          >
            {isLoading ? 'Processing...' : 'Upload'}
          </label>
          <Input
            className="hidden"
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
}