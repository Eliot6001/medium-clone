import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "../context/SupabaseContext";
import { useLocalStorage } from './useLocalStorage';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export function useProfile() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [ROLE, setROLE] = useState<"USER" | "MODERATOR" | null>(null);
  const [createdAt, setCreatedat] = useState<string | null>(null);

  const [cachedProfile, setCachedProfile] = useLocalStorage('userProfile', null);
  const { toast } = useToast();
  const { session } = useSession();

  useEffect(() => {
    let ignore = false;

    async function getProfile() {
      try {
        setLoading(true);

        const { user } = session;
        setCreatedat(user.created_at);
        console.log(user, "gotten this user from usepROFILEDATA")
        // cache check
        if (cachedProfile && (Date.now() - cachedProfile.timestamp < 3600000)) {
          setUsername(cachedProfile.username);
          setWebsite(cachedProfile.website);
          setAvatarUrl(cachedProfile.avatar_url);
          setROLE(cachedProfile.ROLE);
          setLoading(false);
          return;
        }

        const { data } = await axios.get(`${backendUrl}/profiles/ownProfile`, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (data && !ignore) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
          setROLE(data.ROLE ?? "USER"); // fallback if missing
          setCachedProfile({
            username: data.username,
            website: data.website,
            avatar_url: data.avatar_url,
            ROLE: data.ROLE ?? "USER",
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed!',
          description: `Error: ${(error as any)?.message || error}`,
          duration: 1500,
        });
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (session) {
      getProfile();
    }

    return () => {
      ignore = true;
    };
  }, [session, setCachedProfile, cachedProfile, toast]);

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
