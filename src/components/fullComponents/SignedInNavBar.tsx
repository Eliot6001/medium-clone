import { Link } from 'react-router-dom'
import Logo from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"
import { UserCircle, Bell, PenSquare, MenuIcon } from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Button } from "@/components/ui/button";

const SignedInNavbar = () => {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 apply-colors-secondary">
      <Sheet>
        <SheetTrigger asChild >
          <Button variant="outline" size="icon" className="rounded-xl lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="h-screen w-20 flex px-4 flex-col">
          <Link href="#" className="mr-6 lg:flex" >
            <Logo className="w-8 h-6" />
            <span className="sr-only">Thread</span>
          </Link>

          <div className="grid gap-2 py-6">
            <Link href="#" className="a-primary w-fit flex gap-2 px-2" >
              <PenSquare />
              <span className="sr-only">Write</span>
            </Link>

            <Link to="/notifications" className="a-primary w-fit px-2">
              <Bell />
              <span className="sr-only">Notifications</span>
            </Link>

            <Link to="/profile" className="a-primary px-2 w-fit">
              <UserCircle />
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
        <Link to="/profile" className="a-primary">
          <UserCircle />
          <span className="sr-only">Profile</span>
        </Link>
        <ModeToggle className="apply-colors-primary rounded-xl" />
      </nav>
    </header>
  )
}

export default SignedInNavbar
