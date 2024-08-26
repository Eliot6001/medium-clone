import { Outlet } from "react-router-dom";
import { SessionProvider } from "../context/SupabaseContext";
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { Toaster } from "@/components/ui/toaster"

const AuthProviders = () => {
  return (
    <SessionProvider>

      <ThemeProvider>
        <Outlet />
        <Toaster />
      </ThemeProvider>

    </SessionProvider>
  );
};

export default AuthProviders;
