import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '../supabaseClient'
import { useSession } from "../context/SupabaseContext";
import { useLocalStorage } from './useLocalStorage';

export function useProfile() {

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
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

        //catching
        if (cachedProfile && (Date.now() - cachedProfile.timestamp < 3600000)) {
          setUsername(cachedProfile.username);
          setWebsite(cachedProfile.website);
          setAvatarUrl(cachedProfile.avatar_url);

          setLoading(false);
          return;
        }

        let { data, error, status } = await supabase
          .from('user_profiles')
          .select(`username, website, avatar_url`)
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
  }, [session, supabase, setCachedProfile, cachedProfile]);

  return { loading, username, website, avatarUrl, createdAt };
}
export default useProfile;
