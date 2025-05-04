import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabaseClient.ts";
import LoadingPage from "../components/LoadingPage.tsx";
import { Session } from "@supabase/supabase-js";

const SessionContext = createContext<{
  session: Session | null;
}>({
  session: null,
});

//I gotta rewrite this  so it has a authManager 
// That handles login, logout and session checks,
// Should talk to third party auth, supabase
//ensures userdata is synced 

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

type Props = { children: React.ReactNode };

export const SessionProvider = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const authStateListener = supabase.auth.onAuthStateChange(
      //@ts-ignore
      async (_: any, session :any) => {
        setSession(session);
        setIsLoading(false);
      }
    );

    return () => {
      authStateListener.data.subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session }}>
      {isLoading ? <LoadingPage /> : children}
    </SessionContext.Provider>
  );
};
