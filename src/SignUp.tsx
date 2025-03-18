import { useState } from 'react'
import supabase from './supabaseClient'
import { Navigate, useNavigate } from 'react-router-dom'
import Nav from './components/fullComponents/Nav'
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
import { useSession } from "./context/SupabaseContext";

export default function SignUp() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false)
  const { session } = useSession();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [allowed, setAllowed] = useState(false)


  const { toast } = useToast()

  const navigate = useNavigate()

  if (session) return <Navigate to="/" />;

  ///
  /// This function checks if the password contains invalid characters
  ///
  const handlePassword = (password: string) => {
    const allowedPattern = /^[a-zA-Z0-9_\-.]+$/
    if (!allowedPattern.test(password)) {
      toast({
        variant: 'destructive',
        description: 'Password contains invalid characters. Only alphanumeric characters, underscores (_), hyphens (-), and periods (.) are allowed.',
        duration: 1500,
      })
      setAllowed(false)
    } else {
      setAllowed(true)
    }
  }

  ///
  /// This function handles the sign up process
  /// It uses the Supabase auth service to sign up the user
  ///
  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    handlePassword(password)
    if (allowed) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options:{
          emailRedirectTo:`${backendUrl}/auth/confirm`
        }
      })

      if (error) {
        toast({
          variant: 'destructive',
          description: error.message,
        })
      } else {
        toast({
          variant: 'success',
          title: "Success",
          description: `Welcome ${email}! Check your email to confirm your account.`,
        })
        navigate('/home')
      }
      setLoading(false)
    } else {
      setLoading(false)
    }
  }
  //
  //I dont feel safe doing this in Client side lol 
  //
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Nav />
      <div className="w-full flex-1 flex items-center justify-center p-4 apply-colors-primary">
        <Card className="shadow-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 transition-all duration-150 h-96 flex flex-col rounded" style={{ width: '40%' }}>
          <CardHeader>
            <CardTitle className="dark:text-zinc-100 text-zinc-900">Sign up for an account</CardTitle>
            <CardDescription className="text-zinc-400 dark:text-zinc-600">
              Create your account by entering your email and password below
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex-row items-center justify-center flex">
            <form onSubmit={handleSignUp} className="space-y-4 flex-grow">
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
                      autoComplete="new-password"
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
                className="py-2 whitespace-nowrap dark:text-zinc-300 text-zinc-800
           dark:hover:text-zinc-50 hover:text-zinc-900 font-medium
           dark:bg-zinc-800 bg-zinc-200 dark:hover:bg-zinc-700 hover:bg-zinc-300
           px-1 rounded-xl transition-colors duration-150 border
           dark:border-zinc-600 border-zinc-400 antialiased ml-auto"
              >
                {loading ? (
                  <LoaderCircle className="animate-spin h-5 w-5 mr-3" />
                ) : null}
                {loading ? 'Signing up...' : 'Sign up'}
              </Button>
              <div className="mt-auto flex-grow" />
            </form>
          </CardContent>
          <CardFooter className="flex justify-center items-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <a href="/login"  className="text-primary hover:underline">
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
