import { AlertCircle } from 'lucide-react'

const Errorpage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800">
      <AlertCircle className="w-8 h-8 " />
      <span>
        <p>
          404 Error: Page not found
        </p>

      </span>
    </div>
  )
}

export default Errorpage;
