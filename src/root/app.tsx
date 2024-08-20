import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Button } from "@/components/ui/button";
import { LogIn, MenuIcon, Pen, Plus } from "lucide-react";

const Rootpage = () => {

  return (

    <div className="min-h-screen flex flex-col w-screen">
      {/* Top Navigation */}
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 dark:bg-zinc-800 bg-zinc-200">
        <Sheet>
          <SheetTrigger asChild >
            <Button variant="outline" size="icon" className="rounded-xl lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="h-screen w-1/3 flex flex-col">
            <a href="#" className="mr-6 lg:flex" >
              <Logo className="w-8 h-6" />
              <span className="sr-only">Thread</span>
            </a>
            <div className="grid gap-2 py-6">
              <a href="#" className="flex w-full items-center py-2 gap-2" >
                <Pen />
                Write
              </a>
              <a href="#" className="flex w-full items-center py-2 gap-2" >
                <LogIn />
                Sign in
              </a>
              <a href="#" className="flex w-full items-center py-2 gap-2" >
                <Plus />
                Get started
              </a>
            </div>
            <div className="flex-1 h-auto" />
            <span className="">
              <ModeToggle className=" dark:bg-gray-500 bg-gray-800 rounded-xl hover:bg-gray-900 dark:hover:bg-gray-400" />
            </span>

          </SheetContent>
        </Sheet>

        <a href="#" className="mr-6 hidden lg:flex " >
          <Logo className="w-8 h-6 " />
          <span className="sr-only">Thread</span>
        </a>
        <nav className="ml-auto flex items-center lg:flex gap-6 hidden lg:flex">
          <a href="#" className="w-full py-2 text-black font-light hover:text-zinc-950 dark:text-white
            " >
            Write
          </a>
          <a href="#" className="w-full py-2  whitespace-nowrap text-black dark:text-white font-light hover:text-zinc-950
            " >
            Sign in
          </a>
          <a href="#" className="w-full py-2 flex-col 
            whitespace-nowrap rounded-xl transition-colors
            dark:bg-zinc-300 bg-zinc-700 hover:dark:bg-zinc-300/80 hover:bg-zinc-800 p-2
            text-white font-light hover:text-zinc-50 dark:text-black
            " >
            <p> Get started </p>
          </a>
          <span className="">
            <ModeToggle className="bg-zinc-700 dark:bg-gray-500 rounded-xl hover:bg-gray-900 dark:hover:bg-gray-400" />
          </span>
        </nav>

      </header>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 text-center px-6 py-16">
        <h1 className="text-5xl font-bold leading-tight">
          Human stories & ideas
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          A place to read, write, and deepen your understanding
        </p>
        <button className="mt-8 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800">
          Start reading
        </button>
      </main>

      {/* Footer */}
      <footer className="flex justify-center space-x-6 py-4 text-sm text-gray-500 border-t">
        <a href="#" className="hover:underline">
          Help
        </a>
        <a href="#" className="hover:underline">
          Status
        </a>
        <a href="#" className="hover:underline">
          About
        </a>
        <a href="#" className="hover:underline">
          Careers
        </a>
        <a href="#" className="hover:underline">
          Press
        </a>
        <a href="#" className="hover:underline">
          Blog
        </a>
        <a href="#" className="hover:underline">
          Privacy
        </a>
        <a href="#" className="hover:underline">
          Terms
        </a>
        <a href="#" className="hover:underline">
          Text to speech
        </a>
        <a href="#" className="hover:underline">
          Teams
        </a>
      </footer>
    </div>
  );
};

export default Rootpage;
