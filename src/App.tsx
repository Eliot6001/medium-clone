import './App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

import Auth from './Auth'
import { House } from 'lucide-react'
import Account from './Account'
import Rootpage from './root/app'
import ProtectedRoute from './protectedRoutes/ProtectedRoute'

const pages = [
  {
    label: 'main',
    key: '',
    icon: <House />
  },
]

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="w-screen  min-h-screen">
      <Router>
      <Routes>
        <Route path="/" element={session ? <Navigate to="/home" /> : <Rootpage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/home" element={
          <ProtectedRoute session={session}>
            <Account session={session} />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
    </div>
  )
}

export default App
