import { Outlet } from "react-router-dom";
import { SessionProvider } from "../context/SupabaseContext";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Toaster } from "@/components/ui/toaster";
import ModalProvider from "./modalProvider";

const AuthProviders = () => {
  
  return (
    <SessionProvider>
      <ModalProvider />
      <ThemeProvider>
        <Outlet />
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default AuthProviders;
