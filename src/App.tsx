import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import { Menu } from 'antd'
import { House } from 'lucide-react'
import Account from './Account'
import Rootpage from './root/app'

const pages = [
  {
    label: 'main',
    key: '',
    icon: <House />
  },
]

function App() {

  return (
    <>
      <Rootpage></Rootpage>
    </>
  )
}

export default App
