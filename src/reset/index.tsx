import React from 'react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import TopNavbar from '@/components/fullComponents/topNavbar'
import { supabase } from '../supabaseClient'
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

const Reset = () => {
  const [loading, setLoading] = useState(false)

  const [password, setPassword] = useState('')
  const [confirmPassword, setconfirmPassword] = useState('')

  const handlePassword = (password: string) => {
    const allowedPattern = /^[a-zA-Z0-9_\-\.]+$/
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

  const Matched = (password: string, password2: string) => password === password2;

  const sendResetPassword = async (event: any) => {
    event.preventDefault()
    setLoading(true)

    handlePassword(password)
    const passwordsareTheSame = Matched(password, confirmPassword);

    if (allowed && passwordsareTheSame) {
      const { data, error } =  await supabase.auth.updateUser({ password: password })

      if (error) {
        toast({
          variant: 'destructive',
          description: error.error_description || error.message,
        })
      } else {
        toast({
          variant: 'primary',
          title: "Success",
          description: `You can now login to your account with the new password.`,
        })
        navigate('/home')
      }
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  const [allowed, setAllowed] = useState(false)

  const { toast } = useToast()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavbar />
      <div className="w-full flex-1 flex items-center justify-center p-4 apply-colors-primary">
        <Card className="shadow-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 transition-all duration-150 h-96 flex flex-col rounded" style={{ width: '40%' }}>
          <CardHeader>
            <CardTitle className="dark:text-zinc-100 text-zinc-900">Change your password</CardTitle>
            <CardDescription className="text-zinc-400 dark:text-zinc-600">
              You're about to change your password
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex-row items-center justify-center flex">
            <form onSubmit={sendResetPassword} className="space-y-4 flex-grow">
              <div className="space-y-2">
                <label htmlFor="password-address" className="text-sm font-normal">
                  Password
                </label>
                <div className="relative flex items-center dark:text-white text-black font-medium text-xl">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    required
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-normal">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center dark:text-white text-black font-medium text-xl">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setconfirmPassword(e.target.value)}
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
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
              <div className="mt-auto flex-grow" />
            </form>
          </CardContent>
          <CardFooter className="flex justify-center items-center">
            <p className="text-sm text-muted-foreground">
              Already remembered your password?{' '}
              <a href="/login" className="text-primary hover:underline">
                Login
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Reset
