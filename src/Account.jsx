import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import SignedInNavbar from '@/components/fullComponents/SignedInNavBar'
import Avatar from './Avatar'
import { Button } from './components/ui/button'
import { useSession } from "./context/SupabaseContext";
import { Input } from '@/components/ui/input'
import { useToast } from "@/components/ui/use-toast"

export default function Account() {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  const { toast } = useToast()
  const { session } = useSession();

  useEffect(() => {
    let ignore = false

    async function getProfile() {
      try {
        setLoading(true)
        const { user } = session
        let { data, error, status } = await supabase
          .from('user_profiles')
          .select(`username, website, avatar_url`)
          .eq('id', user.id)
          .single()

        if (error && status !== 406) {
          toast({
            variant: 'destructive',
            title: 'Failed!',
            description: 'Failed to retreive data from db!',
            duration: 1500
          })
          throw error
        }

        if (data) {
          setUsername(data.username)
          setWebsite(data.website)
          setAvatarUrl(data.avatar_url)
        }

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed!',
          description: `Error : ${error}`,
          duration: 1500
        })
      } finally {
        setLoading(false)
      }
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [session])

  async function updateProfile(event, avatarUrl) {
    event.preventDefault()

    setLoading(true)
    const { user } = session

    const updates = {
      id: user.id,
      username,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('user_profiles').upsert(updates)

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Failed!',
        description: `Error : ${error}`,
        duration: 1500
      })
      throw error
    } else {
      setAvatarUrl(avatarUrl)
    }
    setLoading(false)
  }

  return (
    <><SignedInNavbar />
      <div className="container px-8 py-6 w-8/12">
        <form onSubmit={updateProfile} className="space-y-6 apply-colors-primary p-6 rounded-lg shadow-md">
          <div className="flex justify-center">
            <Avatar
              url={avatar_url}
              size={150}
              onUpload={(event, url) => updateProfile(event, url)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-primary font-medium">Email</label>
            <Input
              id="email"
              type="text"
              value={session.user.email}
              disabled
              className="bg-gray-200 dark:bg-zinc-900"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="username" className="text-primary font-medium">Name</label>
            <Input
              id="username"
              type="text"
              required
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              className="apply-colors-primary"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="website" className="text-primary font-medium">Website</label>
            <Input
              id="website"
              type="url"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
              className="apply-colors-primary"
            />
          </div>

          <div className="flex justify-end divide-x-5 gap-2">
            <div>
              <Button variant={"primary"} className="a-primary rounded" type="submit" disabled={loading}>
                {loading ? 'Loading ...' : 'Update'}
              </Button>
            </div>

            <div>
              <Button className="rounded" variant={"outline"} type="button" onClick={() => supabase.auth.signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
