import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient'; // Adjust the path according to your setup

const useAuthSession = () => {
  const [session, setSession] = useState(null);
  const [current, setCurrent] = useState('main');

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup the listener on unmount
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return { session, current, onClick };
};

export default useAuthSession;
