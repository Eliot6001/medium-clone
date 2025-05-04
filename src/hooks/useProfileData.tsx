import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "../context/SupabaseContext";
import { useLocalStorage } from './useLocalStorage';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export function useProfile(passedAccessToken?: string | null) { // Accept optional accessToken
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [ROLE, setROLE] = useState<"USER" | "MODERATOR" | null>(null);
  const [createdAt, setCreatedat] = useState<string | null>(null);

  type ProfileCache = {
    username: string | null;
    website: string | null;
    avatar_url: string | null;
    ROLE: "USER" | "MODERATOR" | null;
    timestamp: number;
  } | null;

  const [cachedProfile, setCachedProfile] = useLocalStorage<ProfileCache>('userProfile', null);
  const { toast } = useToast();
  const { session } = useSession(); // Still use session for fallback and created_at

  useEffect(() => {
    let ignore = false;

    async function getProfile() {
      // Prioritize passed token, fallback to session token
      const tokenToUse = passedAccessToken;

      // If no token is available, stop loading and exit
      if (!tokenToUse) {
          setLoading(false);
          // Clear state if not authenticated
          setUsername(null);
          setWebsite(null);
          setAvatarUrl(null);
          setROLE(null);
          setCreatedat(null);
          setCachedProfile(null); // Consider clearing cache if auth changes
          return;
      }

      try {
        setLoading(true);

        // Try to get user creation date from session if available
        if (session?.user?.created_at) {
          setCreatedat(session.user.created_at);
        } else {
          setCreatedat(null); // Reset if no session user info
        }

        // cache check
        // Define the expected shape of cachedProfile and data
        type ProfileCache = {
          username: string | null;
          website: string | null;
          avatar_url: string | null;
          ROLE: "USER" | "MODERATOR" | null;
          timestamp: number;
        } | null;

        // Type assertion for cachedProfile
        const typedCachedProfile = cachedProfile as ProfileCache;

        if (
          typedCachedProfile &&
          typeof typedCachedProfile.timestamp === "number" &&
          Date.now() - typedCachedProfile.timestamp < 3600000
        ) {
          setUsername(typedCachedProfile.username);
          setWebsite(typedCachedProfile.website);
          setAvatarUrl(typedCachedProfile.avatar_url);
          setROLE(typedCachedProfile.ROLE);
          setLoading(false);
          return;
        }

        // Use the determined token for the request
        const { data }: { data: {
          username: string | null;
          website: string | null;
          avatar_url: string | null;
          ROLE?: "USER" | "MODERATOR" | null;
        }} = await axios.get(`${backendUrl}/profiles/ownProfile`, {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
          },
        });

        if (data && !ignore) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
          setROLE(data.ROLE ?? "USER");
          setCachedProfile({
            username: data.username,
            website: data.website,
            avatar_url: data.avatar_url,
            ROLE: data.ROLE ?? "USER",
            timestamp: Date.now(),
          });
        }
      } catch (error: unknown) {
        let errorMessage = 'Unknown error';
        if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
          errorMessage = (error as { message: string }).message;
        }
        toast({
          variant: 'destructive',
          title: 'Failed!',
          description: `Error retrieving profile: ${errorMessage}`,
          duration: 1500,
        });
         // Clear potentially stale state on error
         setUsername(null);
         setWebsite(null);
         setAvatarUrl(null);
         setROLE(null);
         setCreatedat(null);
         setCachedProfile(null); // Clear cache on error
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    getProfile(); // Call getProfile unconditionally; it checks for a token inside

    return () => {
      ignore = true;
    };
    // Add passedAccessToken to dependency array
  }, [session, passedAccessToken, setCachedProfile, cachedProfile, toast]);

  return React.useMemo(
    () => ({
      loading,
      username,
      website,
      avatarUrl,
      createdAt,
      ROLE,
      clearCache: () => setCachedProfile(null),
    }),
    [loading, username, website, avatarUrl, createdAt, ROLE, setCachedProfile]
  );
}

export default useProfile;