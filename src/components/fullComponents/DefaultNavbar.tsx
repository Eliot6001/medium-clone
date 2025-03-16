import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { LogIn, MenuIcon, Pen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom'

const TopNavbar = () => {
  return (
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 apply-colors-secondary">
        <Sheet>
          <SheetTrigger asChild >
            <Button variant="outline" size="icon" className="rounded-xl lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="px-3 h-screen w-1/3 flex flex-col">
            <Link href="#" className="mr-6 lg:flex" >
              <Logo className="w-8 h-6" />
              <span className="sr-only">Thread</span>
            </Link>
            <div className="grid gap-2 py-6">
              <Link href="#" className="a-primary w-32 flex gap-2" >
                <Pen />
                Write
              </Link>
              <Link href="#" className="a-primary w-32 flex gap-2" >
                <LogIn />
                Sign in
              </Link>
              <Link href="#" className="a-secondary gap-2 w-32 flex-initial flex" >
                <Plus />
                Get started
              </Link>
            </div>
            <div className="flex-1 h-auto" />
            <span className="">
              <ModeToggle className="apply-colors-primary rounded-xl"/>
            </span>
          </SheetContent>
        </Sheet>

        <Link href="#" className="mr-6 hidden lg:flex " >
          <Logo className="w-8 h-6 " />
          <span className="sr-only">Thread</span>
        </Link>
        <nav className="ml-auto flex items-center gap-6 hidden lg:flex">
          <Link to='/write' className="a-primary" >
            Write
          </Link>
          <Link to='/login' className="a-primary" >
            Sign in
          </Link>
          <Link to='/signup' className="a-secondary" >
            <p> Get started </p>
          </Link>
          <span className="">
            <ModeToggle className="apply-colors-primary rounded-xl" />
          </span>
        </nav>

      </header>

  )
}

export default TopNavbar
