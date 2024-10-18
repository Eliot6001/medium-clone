import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Facebook, Github, Instagram, Twitter, X } from 'lucide-react'
import { cn } from '@/lib/utils';
import  Avatar  from "@/Avatar";
import { useState, useEffect } from 'react'

interface ProfileData {
  pfpUrl?: string;
  username: string;
  socials?: {
    ig?: string;
    twitter?: string;
    github?: string;
  },
  website?: string;
  bio?: string;
  time_joined: string;
  personal: boolean;
}
const ProfileData = ({ pfpUrl, username, socials = {}, website,bio, time_joined, personal = false}: ProfileData) => {
  const [Socialmedia, setSocialmedia] = useState<Partial<ProfileData['socials']>>({});

  const time = time_joined ? new Date(time_joined).toLocaleDateString() : 'Err'

  useEffect(() => {
    const updatedSocialmedia: Partial<ProfileData['socials']> = {};

    Object.entries(socials).forEach(([platform, link]) => {
      if (link) {
        updatedSocialmedia[platform as keyof ProfileData['socials']] = link;
      }
    });

    setSocialmedia(updatedSocialmedia);
  }, [])

  return (
    <Card className="shadow dark:shadow-zinc-800 shadow-zinc-300 w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <Avatar url={pfpUrl}  size={80} onPublicRoute />
          <span>
            <p className="text-primary text-normal leading-7 [&:not(:first-child)]:mt-6">{username}</p>
            <p className="dark:text-zinc-200/50 hover:dark:text-zinc-200/50 hover:text-zinc-900/50 text-zinc-900/50 text-base"> <small>Joined at: {time} </small> </p>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0.5">
        <div className="text-lg font-semibold">About</div>
        <p className={cn("text-base leading-7 [&:not(:first-child)]:mt-6", !bio && 'text-muted text-zinc-900/45 dark:text-zinc-200/45')}>{bio ? bio : 'There is no information.'}</p>
        {website && <span className="flex  flex-col align-center">
          <p className="w-fit text-sm mt-2"> Personal Website: </p>
          <a className="" href={website} target={"_blank"} rel="noopener noreferrer">{website} </a>
        </span>}
      </CardContent>
      <CardFooter className="space-x-2 flex items-center select-none">
        {Socialmedia?.ig && (
          <a href={Socialmedia?.ig} target="_blank" rel="noopener noreferrer">
            <span className="a-secondary">
              <Instagram />
            </span>
          </a>
        )}
        {Socialmedia?.twitter && (
          <a href={Socialmedia?.twitter} target="_blank" rel="noopener noreferrer">
            <span className="a-secondary">
              <Twitter />
            </span>
          </a>
        )}
        {Socialmedia?.github && (
          <a href={Socialmedia?.github} target="_blank" rel="noopener noreferrer">
            <span className="a-secondary">
              <Github />
            </span>
          </a>
        )}      
      </CardFooter>
    </Card>
  )
}

export default ProfileData
