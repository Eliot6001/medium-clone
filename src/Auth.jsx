import { useState } from 'react'
import { useSession } from "./context/SupabaseContext";
import { supabase } from './supabaseClient'
import { useNavigate, Navigate } from 'react-router-dom'
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
import { Key, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState(''); // Add password state
  const [allowed, setAllowed] = useState(false);

  const { session } = useSession();
  if (session) return <Navigate to="/" />;

  const { toast } = useToast()
  const navigate = useNavigate()

  const handlePassword = (password) => {
    const allowedPattern = /^[a-zA-Z0-9_\-\.]+$/;
    if (!allowedPattern.test(password)) {
      toast({
        variant: 'destructive',
        description: 'Password contains invalid characters. Only alphanumeric characters, underscores (_), hyphens (-), and periods (.) are allowed.',
        duration: 1500
      })
      setAllowed(false)
    }
    else {
      setAllowed(true)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    handlePassword(password)
    if (allowed) {

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        alert(error.error_description || error.message)
      } else {
        toast({
          title: "Success",
          description: `Welcome ${data.email}`,
        })
        navigate('/home')
      }
      setLoading(false)
    }
    else {
      setLoading(false)
    }
  }

  return (
    /*ill need to implement PKCE flow*/
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavbar />
      <div className="w-full flex-1 flex items-center justify-center p-4 apply-colors-primary">
        <Card className="shadow-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 transition-all duration-150 h-96 flex flex-col rounded" style={{ width: '40%' }}>
          <CardHeader>
            <CardTitle className="dark:text-zinc-100 text-zinc-900">Sign in to your account</CardTitle>
            <CardDescription className="text-zinc-400 dark:text-zinc-600">
              Sign in
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex-row items-center justify-center flex">
            <form onSubmit={handleLogin} className="space-y-4 flex-grow">
              <div className="space-y-1">
                <label htmlFor="email-address" className="text-sm font-normal">
                  Email address
                </label>
                <div className="relative flex items-center dark:text-white text-black font-medium text-xl">
                  <Mail className="absolute left-0 ml-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" style={{ marginLeft: '0.35rem', height: '1.25rem', width: '1.25rem' }} />
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
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-normal">
                    Password
                  </label>
                  <div className="relative flex items-center dark:text-white text-black font-medium text-xl">
                    <Key className="absolute left-0 ml-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" style={{ marginLeft: '0.35rem', height: '1.25rem', width: '1.25rem' }} />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingLeft: '2rem' }}
                    />
                  </div>
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

          <CardFooter className="flex justify-center items-center ">
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
