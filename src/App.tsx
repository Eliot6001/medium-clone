import './App.css'
import { RouterProvider } from 'react-router-dom'
import Router from "./router/Router";

function App() {

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800">
      <RouterProvider router={Router} />
    </div>
  )
}

export default App
