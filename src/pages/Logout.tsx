import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import useProfile from "@/hooks/useProfileData";
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
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
