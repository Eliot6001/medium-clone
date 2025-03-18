import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '../supabaseClient'
import { useSession } from "../context/SupabaseContext";
import { useLocalStorage } from './useLocalStorage';

export function useProfile() {

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [ROLE, setROLE] = useState<"USER" | "MODERATOR" | null>(null);
  const [createdAt, setCreatedat] = useState(null);

  const [cachedProfile, setCachedProfile] = useLocalStorage('userProfile', null);
  const { toast } = useToast()
  const { session } = useSession();

  useEffect(() => {
    let ignore = false;

    async function getProfile() {

      try {
        setLoading(true);
        const { user } = session
        const createdAt = setCreatedat(user.created_at); 

        //cache for 1 hour
        if (cachedProfile && (Date.now() - cachedProfile.timestamp < 3600000)) {
          setUsername(cachedProfile.username);
          setWebsite(cachedProfile.website);
          setAvatarUrl(cachedProfile.avatar_url);
          setROLE(cachedProfile.ROLE);
          setLoading(false);
          return;
        }

        const { data, error, status } = await supabase
          .from('user_profiles')
          .select(`username, website, avatar_url, ROLE`)
          .eq('id', user.id)
          .single();

        if (error && status !== 406) {
          toast({
            variant: 'destructive',
            title: 'Failed!',
            description: 'Failed to retrieve data from db!',
            duration: 1500
          });
          throw error;
        }

        if (data && !ignore) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
          setROLE(data.ROLE);
          //cache again
          setCachedProfile({
            ...data,
            timestamp: Date.now()
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed!',
          description: `Error: ${error}`,
          duration: 1500
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
//Memoized in order to prevent unnecessary re-renders
  return React.useMemo(
    () => ({
      loading,
      username,
      website,
      avatarUrl,
      createdAt,
      ROLE
    }),
    [loading, username, website, avatarUrl,ROLE, createdAt]
  );
}
export default useProfile;
