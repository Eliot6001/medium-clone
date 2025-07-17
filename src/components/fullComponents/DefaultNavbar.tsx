import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { LogIn, MenuIcon, Pen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TopNavbar = () => {
  return (
    <header className="flex h-20 w-full items-center justify-between px-4 md:px-6 apply-colors-secondary shadow-sm">
      {/* Mobile Nav */}
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-xl">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80vw] max-w-xs p-6 flex flex-col justify-between">
            {/* Top: Logo */}
            <Link to="/main" className="flex items-center gap-2 mb-6">
              <Logo className="w-8 h-6" />
              <span className="text-lg font-semibold">Thread</span>
            </Link>

            {/* Middle: Nav Links */}
            <nav className="flex flex-col gap-4">
              <Link to="/write" className="a-primary flex items-center gap-2 w-full">
                <Pen className="h-5 w-5" />
                Write
              </Link>
              <Link to="/login" className="a-primary flex items-center gap-2 w-full">
                <LogIn className="h-5 w-5" />
                Sign in
              </Link>
              <Link to="/signup" className="a-secondary flex items-center gap-2 w-full">
                <Plus className="h-5 w-5" />
                Get started
              </Link>
            </nav>

            {/* Bottom: Theme toggle */}
            <div className="mt-10">
              <ModeToggle className="apply-colors-primary rounded-xl" />
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile Logo */}
        <Link to="/main" className="flex items-center gap-2">
          <Logo className="w-8 h-6" />
          <span className="sr-only">Thread</span>
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden lg:flex w-full items-center justify-between">
        <Link to="/main" className="flex items-center gap-2">
          <Logo className="w-8 h-6" />
          <span className="sr-only">Thread</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/write" className="a-primary">
            Write
          </Link>
          <Link to="/login" className="a-primary">
            Sign in
          </Link>
          <Link to="/signup" className="a-secondary">
            Get started
          </Link>
          <ModeToggle className="apply-colors-primary rounded-xl" />
        </nav>
      </div>
    </header>
  );
};

export default TopNavbar;
