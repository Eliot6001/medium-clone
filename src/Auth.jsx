import { useState } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'
import TopNavbar from './components/fullComponents/topNavbar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event) => {

    event.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Check your email for the login link!')
      navigate('/home')
    }
    setLoading(false)

  }

  return (
    /*ill need to implement PKCE flow*/
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavbar />
      <div className="w-full flex-1 flex items-center justify-center p-4 apply-colors-primary">
        <Card className="shadow-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 transition-all duration-150 h-96 flex flex-col" style={{ width: '40%' }}>
          <CardHeader>
            <CardTitle className="dark:text-zinc-100 text-zinc-900">Sign in to your account</CardTitle>
            <CardDescription className="text-zinc-400 dark:text-zinc-600">
              Sign in via magic link with your email below
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex-row items-center justify-center flex">
            <form onSubmit={handleLogin} className="space-y-4 flex-grow">
              <div className="space-y-2">
                <label htmlFor="email-address" className="text-sm font-medium">
                  Email address
                </label>
                <div className="relative flex items-center dark:text-white text-black font-medium text-xl">
                  <Mail className="absolute left-0 ml-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" style={{ marginLeft: '0.25rem' }} />
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '2rem' }}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="py-2 whitespace-nowrap text-black dark:text-white dark:hover:text-zinc-950 hover:text-zinc-950 
                font-medium hover:bg-zinc-300 px-1 rounded-xl transition-colors duration-300 border border-zinc-400 antialiased dark:border-zinc-200"
              >
                {loading ? (
                  <LoaderCircle className="animate-spin h-5 w-5 mr-3" />
                ) : null}
                {loading ? 'Sending...' : 'Send magic link'}
              </Button>
              <div className="mt-auto flex-grow" />
            </form>
          </CardContent>
          <CardFooter className="flex justify-center ">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="#" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
