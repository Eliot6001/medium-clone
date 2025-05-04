import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Adjust the path according to your setup

import type { Session } from '@supabase/supabase-js';

const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [current, setCurrent] = useState('main');

  interface OnClickEvent {
    key: string;
    [key: string]: unknown;
  }

  const onClick = (e: OnClickEvent): void => {
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
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { session, current, onClick };
};

export default useAuthSession;
