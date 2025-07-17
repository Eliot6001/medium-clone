import { Link } from "react-router-dom";
import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import {
  UserCircle,
  Bell,
  PenSquare,
  MenuIcon,
  LogOut,
  Globe,
} from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SupabaseContext";
import useProfile from "@/hooks/useProfileData";
import { useEffect, useState, Suspense } from "react";
import Avatar from "../../Avatar";
import { cn } from "@/lib/utils";
import SearchButton from "./searchButton";
import axios from "axios";
import { useModal } from "@/hooks/useStoreModal";

const SignedInNavbar = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { session } = useSession();
  const [avatar, setAvatar] = useState<string | null>(null);
  const { loading, avatarUrl } = useProfile(session?.access_token);
  const [showModal, setModal] = useState<boolean>(false);
  const { onOpen } = useModal();

  useEffect(() => {
    axios
      .get(`${backendUrl}/profiles/hasInterests`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      .then((res) =>
        res.data.data.toUpperCase() === "CHOOSE"
          ? setModal(true)
          : setModal(false)
      );
  }, [session?.user.id]);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        onOpen("interestsModal", {
          preferred_fields: [],
          session: { access_token: session?.access_token as string },
        });
      }, 0);
    }
  }, [showModal]);

  useEffect(() => {
    if (avatarUrl) setAvatar(avatarUrl);
  }, [loading, avatarUrl]);

  return (
    <Suspense>
      <header className="container flex items-center justify-between h-20 px-4 md:px-6 bg-white dark:bg-zinc-950 shadow-sm">
        {/* Left: Logo and mobile menu */}
        <div className="flex items-center gap-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-6">
              <nav className="flex flex-col gap-5">
                <Link to="/main" className="flex items-center gap-2">
                  <Logo className="w-6 h-6" />
                  <span className="text-lg font-semibold">Thread</span>
                </Link>
                <Link to="/write" className="a-primary flex items-center gap-2">
                  <PenSquare className="h-5 w-5" />
                  <span>Write</span>
                </Link>
                <Link to="/explore" className="a-primary flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span>Explore</span>
                </Link>
                <Link to="/notifications" className="a-primary flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </Link>
                <Link to="/profile" className="a-primary flex items-center gap-2">
                  {avatar ? (
                    <Avatar url={avatar} size={28} onPublicRoute />
                  ) : (
                    <UserCircle className="h-5 w-5" />
                  )}
                  <span>Profile</span>
                </Link>
                {session?.user && (
                  <Link to="/logout" className="a-primary flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Link>
                )}
                <ModeToggle className="apply-colors-primary rounded-xl" />
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo (always shown) */}
          <Link to="/main" className="flex items-center gap-2">
            <Logo className="w-8 h-6" />
            <span className="sr-only">Thread</span>
          </Link>
        </div>

        {/* Center: Search (only on lg) */}
        <div className="hidden lg:flex flex-1 justify-center">
          <SearchButton />
        </div>

        {/* Right: desktop-only nav */}
        <nav className="hidden lg:flex items-center gap-5">
          <Link to="/write" className="a-primary">
            <PenSquare className="h-5 w-5" />
          </Link>
          <Link to="/explore" className="a-primary">
            <Globe className="h-5 w-5" />
          </Link>
          <Link to="/notifications" className="a-primary">
            <Bell className="h-5 w-5" />
          </Link>
          <Link to="/profile" className={cn("a-primary", !avatar && "text-muted")}>
            {avatar ? (
              <Avatar className="rounded-full" url={avatar} size={28} onPublicRoute />
            ) : (
              <UserCircle className="h-5 w-5" />
            )}
          </Link>
          {session?.user && (
            <Link to="/logout" className="a-primary">
              <LogOut className="h-5 w-5" />
            </Link>
          )}
          <ModeToggle className="apply-colors-primary rounded-xl" />
        </nav>
      </header>
    </Suspense>
  );
};

export default SignedInNavbar;
