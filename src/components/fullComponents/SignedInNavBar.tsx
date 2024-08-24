import { Link } from 'react-router-dom'
import Logo from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"
import { UserCircle, Bell, PenSquare } from 'lucide-react'

const SignedInNavbar = () => {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 apply-colors-secondary">
      <Link to="/home" className="mr-6">
        <Logo className="w-8 h-6" />
        <span className="sr-only">Thread</span>
      </Link>
      <nav className="ml-auto flex items-center gap-6">
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
