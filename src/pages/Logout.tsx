import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import useProfile from "@/hooks/useProfileData";
import LoadingPage from "@/components/LoadingPage";
const Logout: React.FC = () => {
  const navigate = useNavigate();
  const {clearCache} = useProfile()
  useEffect(() => {
    const signOut = async () => {
      clearCache();
      await supabase.auth.signOut();
      navigate("/");
    };

    signOut();
    
  }, [navigate,clearCache]);

  return (
    <div>
      <LoadingPage /> 
      Logging you out...
    </div>
  );
};

export default Logout;
