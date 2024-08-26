import './App.css'
import { RouterProvider } from 'react-router-dom'
import Router from "./router/Router";

function App() {

  return (
    <div className="w-screen  min-h-screen">
      <RouterProvider router={Router} />
    </div>
  )
}

export default App
