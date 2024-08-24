
import TopNavbar from "@/components/fullComponents/topNavbar";
import { Button } from "@/components/ui/button";

const Rootpage = () => {

  return (

    <div className="min-h-screen flex flex-col w-screen">
      <TopNavbar />

      <main className="flex flex-col items-start justify-center flex-1 text-center px-6 py-16 apply-colors-primary">
        <h1 className="text-5xl font-bold leading-tight text-primary">
          Human stories & ideas
        </h1>
        <p className="mt-4 text-lg text-secondary">
          A place to read, write, and deepen your understanding
        </p>
        <Button className="mt-8 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 a-secondary ">
          Start reading
        </Button>
      </main>

      {/* Footer */}
      <footer className="flex justify-center space-x-6 py-4 text-sm text-gray-500 border-t apply-colors-secondary">
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
