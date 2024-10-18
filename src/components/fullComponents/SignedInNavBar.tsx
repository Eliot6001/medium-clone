import { Link } from 'react-router-dom'
import Logo from "@/components/logo.jsx"
import { ModeToggle } from "@/components/mode-toggle"
import { UserCircle, Bell, PenSquare, MenuIcon } from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Button } from "@/components/ui/button";
import { useSession } from '@/context/SupabaseContext'
import useProfile from '@/hooks/useProfileData'
import { useEffect, useState } from 'react'
import Avatar from '../../Avatar'
import { cn } from '@/lib/utils'

const SignedInNavbar = () => {
  const { session } = useSession();
  const [avatar, setAvatar] = useState<string | null>(null);

  const { loading, avatarUrl } = useProfile();

  useEffect(() => {
    if (avatarUrl) setAvatar(avatarUrl)
  }, [loading, avatarUrl])

  return (
    <header className="container flex h-20 w-full rounded shrink-0 items-center px-4 md:px-6 apply-colors-secondary dark:bg-zinc-950">
      <Sheet>
        <SheetTrigger asChild >
          <Button variant="outline" size="icon" className="rounded-xl lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="h-screen w-20 flex px-4 flex-col">

          <Link to="/home" className="ml-2 lg:flex" >
            <Logo className="w-8 h-6" />
            <span className="sr-only">Thread</span>
          </Link>

          <div className="grid gap-2 py-6 justify-center">
            <Link to="#" className="a-primary w-fit flex gap-2 px-2" >
              <PenSquare />
              <span className="sr-only">Write</span>
            </Link>

            <Link to="/notifications" className="a-primary w-fit px-2">
              <Bell />
              <span className="sr-only">Notifications</span>
            </Link>

            <Link to="/profile" className={cn("w-full", !avatar && 'a-primary')}>
              {!avatar && <UserCircle />}
              {avatar && <Avatar url={avatar} size={28} onPublicRoute={true} />}
              <span className="sr-only">Profile</span>
            </Link>

          </div>
          <div className="flex-1 h-auto px-2 w-fit" />
          <span className="">
            <ModeToggle className="apply-colors-primary rounded-xl" />
          </span>
        </SheetContent>
      </Sheet>

      <Link to="/home" className="mr-6 lg:flex hidden">
        <Logo className="w-8 h-6" />
        <span className="sr-only">Thread</span>
      </Link>
      <nav className="ml-auto items-center gap-6 lg:flex hidden">
        <Link to="/write" className="a-primary">
          <PenSquare />
          <span className="sr-only">Write</span>
        </Link>
        <Link to="/notifications" className="a-primary">
          <Bell />
          <span className="sr-only">Notifications</span>
        </Link>
        <ModeToggle className="apply-colors-primary rounded-xl" />
        <Link to="/profile" className={cn("rounded-xl", !avatar && 'a-primary')}>
          {!avatar && <UserCircle />}
          {avatar && <Avatar className="rounded-full " url={avatar} size={28} onPublicRoute={true} />}
          <span className="sr-only">Profile</span>
        </Link>
      </nav>
    </header>
  )
}

export default SignedInNavbar
