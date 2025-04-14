import { cn } from "@/lib/utils"
import './LoadingPage.css' /* CSS file to define animations, sadly*/

const LoadingPage = ({className}: {className?: string}) => {
  return (
    
    <section className={
      "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 " + 
      "w-96 h-96  " +
      "flex flex-col items-center justify-center " + 
      "scale-130 md:scale-100 " + 
      (className ? ` ${className}` : "") 
    }>
      <div className="
          w-5 aspect-square                            
          border-2 border-zinc-600 dark:border-zinc-300
      
          rounded-[0.3rem]                             
          mb-[0.2rem]                                   
          origin-bottom-right   
          animate-roll "></div> 
          <div className="relative w-[60px] h-[4px] overflow-hidden infinite-scroll
           after:bg-zinc-700 after:dark:bg-zinc-300
          before:bg-zinc-700 before:dark:bg-zinc-300"/>
    </section>
  )
}

export default LoadingPage
