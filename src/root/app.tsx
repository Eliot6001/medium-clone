
import { Button } from "@/components/ui/button";
import Navbar from "@/components/fullComponents/Nav";
import Sphere from '@/components/sphere'
import { useTheme } from "@/components/theme-provider";
import { AndroidToggle } from "@/components/ui/AndroidToggle";
import { Suspense, useState } from "react";


const Rootpage = () => {
  const darkMode = useTheme();
  const [disable, setDisable] = useState<boolean>(false);
  const setToggle = () => {
    setDisable(!disable)
  }
  return (
    <div className="min-h-screen flex flex-col w-screen ">
      <Navbar />
      <main className="flex w-full justify-center flex-1 lg:px-8 px-2 apply-colors-primary">
        <div className="flex flex-col justify-center items-start w-full lg:w-1/2 py-16 ">
          <h1 className="lg:text-5xl text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-200 ">
            Human stories & ideas
          </h1>
          <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-400 ">
            A place to read, write, and deepen your understanding
          </p>
          <Button className="mt-8 bg-black text-white px-6 py-3 rounded-full dark:hover:bg-zinc-200 hover:bg-zinc-900 a-secondary">
            Start reading
          </Button>
        </div>
        <div className="lg:flex flex-col hidden h-screen justify-center lg:h-full lg:w-full ml-auto relative p-3 space-y-2">
          <Suspense>
          <Sphere isDark={darkMode.theme === "dark"} disableForwarding={disable}/>
          </Suspense>
          <div className="space-x-6 flex"> 
            <p>Disable Forwarding <small> (-messing around mode-)</small>:</p>
            <AndroidToggle onCheckedChange={setToggle} checked={disable}/>
          </div>
        </div>
        
      </main>
      {/* Footer */}
      <footer className="flex justify-center space-x-6 py-4 text-sm text-gray-500 border-t apply-colors-secondary">
        <a href="#" className="a-primary hover:underline">
          Help
        </a>
        <a href="#" className="a-primary hover:underline">
          Status
        </a>
        <a href="#" className="a-primary hover:underline">
          About
        </a>
        <a href="#" className="a-primary hover:underline">
          Careers
        </a>
        <a href="#" className="a-primary hover:underline">
          Press
        </a>
        <a href="#" className="a-primary hover:underline">
          Blog
        </a>
        <a href="#" className="a-primary hover:underline">
          Privacy
        </a>
        <a href="#" className="a-primary hover:underline">
          Terms
        </a>
        <a href="#" className="a-primary hover:underline">
          Text to speech
        </a>
        <a href="#" className="a-primary hover:underline">
          Teams
        </a>
      </footer>
    </div>
  );
};

export default Rootpage;

