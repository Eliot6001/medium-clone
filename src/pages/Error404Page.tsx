import { AlertCircle } from 'lucide-react'
import React from 'react'

const Errorpage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
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
