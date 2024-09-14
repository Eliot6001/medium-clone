import { useState } from 'react'
import supabase from './supabaseClient.js'
import { Navigate, useNavigate } from 'react-router-dom'
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
import { useSession } from "./context/SupabaseContext";



const ResetPassword = () => {
  const [loading, setLoading] = useState(false)
  const { session } = useSession();
  if (session) return <Navigate to="/" />;
  const [password, setPassword] = useState('')
  const [allowed, setAllowed] = useState(false)

  const { toast } = useToast()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavbar />
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
              <a href="/login" className="text-primary hover:underline">
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>)
}

export default ResetPassword
