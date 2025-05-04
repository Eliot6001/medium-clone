import { Link } from "react-router-dom";
import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { UserCircle, Bell, PenSquare, MenuIcon, LogOut } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SupabaseContext";
import useProfile from "@/hooks/useProfileData";
import { useEffect, useState } from "react";
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
  const { onOpen } = useModal()

  useEffect(() => {
    axios.get(`${backendUrl}/profiles/hasInterests`, {
      headers: {Authorization: `Bearer ${session?.access_token}`}
    }).then(res => res.data.data.toUpperCase() === "CHOOSE" ? setModal(true) : setModal(false))
  }, [session?.user.id])
  
  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        onOpen("interestsModal", { preferred_fields: [], session: {access_token: session?.access_token as string} });
      }, 0); //small delay to prevent react complaining!
    }
  }, [showModal])

  useEffect(() => {
    if (avatarUrl) setAvatar(avatarUrl);
  }, [loading, avatarUrl]);

  return (
    <header className="container flex h-20 w-full items-center px-4 md:px-6 bg-white dark:bg-zinc-950 shadow-sm">
      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl lg:hidden"
            aria-label="Open navigation menu"
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex h-screen w-20 flex-col px-4 py-6 gap-6"
        >
          <Link to="/main" className="flex items-center justify-center">
            <Logo className="w-8 h-6" />
            <span className="sr-only">Thread</span>
          </Link>
          <div className="flex flex-col items-center gap-6">
          <Link
            to="/write"
            className="a-primary group inline-flex items-center overflow-hidden transition-all duration-300"
            aria-label="Write"
          >
            <PenSquare className="h-5 w-5" />
            <span className="ml-2 max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-[4rem] group-hover:opacity-100 opacity-0">
              Write
            </span>
          </Link>
            <Link
              to="/notifications"
              className="a-primary flex flex-col items-center"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Link>
            <Link
              to="/profile"
              className={cn(
                "flex flex-col items-center",
                !avatar && "a-primary"
              )}
            >
              {!avatar && <UserCircle className="h-5 w-5" />}
              {avatar && <Avatar url={avatar} size={28} onPublicRoute />}
              <span className="sr-only">Profile</span>
            </Link>
          </div>
          <div className="mt-auto flex flex-col items-center gap-4">
            {session?.user && (
              <Link to="/logout" className="a-primary" aria-label="Logout">
                <LogOut className="h-5 w-5" />
              </Link>
            )}
            <ModeToggle className="apply-colors-primary rounded-xl" />
          </div>
        </SheetContent>
        <div className="sm:flex lg:hidden flex-1 justify-start ml-10 ">
          <SearchButton />
        </div>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="lg:flex flex-1 items-center justify-between hidden">
        <Link to="/main" className="hidden lg:flex items-center ">
          <Logo className="w-8 h-6" />
          <span className="sr-only">Thread</span>
        </Link>
        <div className="flex flex-1 justify-start ml-10 ">
          <SearchButton />
        </div>
        <nav className="flex items-center gap-5 ">
          <Link
            to="/write"
            className="a-primary group inline-flex items-center overflow-hidden transition-all duration-300"
            aria-label="Write"
          >
            <PenSquare className="h-5 w-5" />
            <span className="ml-2 max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-[4rem] group-hover:opacity-100 opacity-0">
              Write
            </span>
          </Link>
          <Link
            to="/notifications"
            className="a-primary"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Link>
          <Link
            to="/profile"
            className={cn("rounded-xl", !avatar && "a-primary")}
            aria-label="Profile"
          >
            {!avatar && <UserCircle className="h-5 w-5" />}
            {avatar && (
              <Avatar
                className="rounded-full"
                url={avatar}
                size={28}
                onPublicRoute
              />
            )}
          </Link>
          {session?.user && (
            <Link to="/logout" className="a-primary" aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </Link>
          )}
          <ModeToggle className="apply-colors-primary rounded-xl" />
        </nav>
      </div>
    </header>
  );
};

export default SignedInNavbar;
