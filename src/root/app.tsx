
import TopNavbar from "@/components/fullComponents/topNavbar";
import { Button } from "@/components/ui/button";
import Image from "../assets/pexels-evie-shaffer-1259279-8735276.webp"
const Rootpage = () => {

  return (

    <div className="min-h-screen flex flex-col w-screen">
      <TopNavbar />

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
        <span className="lg:flex hidden h-full justify-center lg:w-1/2  ml-auto mt-2">
          <img src={Image} className="w-1/2 object-contain ml-auto py-2 " alt="Human stories" />
        </span>
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
