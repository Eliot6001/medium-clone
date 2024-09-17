import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Facebook, Github, Instagram, Twitter, X } from 'lucide-react'
import { cn } from '@/lib/utils';

import { useState, useEffect } from 'react'

interface ProfileData {
  pfpUrl?: string;
  username: string;
  socials?: {
    ig?: string;
    twitter?: string;
    github?: string;
  },
  bio?: string;
  time_joined: string;
}
const ProfileData = ({ pfpUrl, username, socials = {}, bio, time_joined}: ProfileData) => {
  const [Socialmedia, setSocialmedia] = useState<Partial<ProfileData['socials']>>({});

  const time = time_joined ? new Date(time_joined).toLocaleString() : 'Err'

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
          <Avatar>
            <AvatarImage src={pfpUrl ? pfpUrl : ''} />
            <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>
            <p className="text-primary text-normal leading-7 [&:not(:first-child)]:mt-6">{username}</p>
            <p className="dark:text-zinc-200/50 hover:dark:text-zinc-200/50 hover:text-zinc-900/50 text-zinc-900/50 text-base"> <small>Joined at: {time} </small> </p>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0.5">
        <div className="text-lg font-semibold">About</div>
        <p className={cn("text-base leading-7 [&:not(:first-child)]:mt-6", !bio && 'text-muted text-zinc-900/45 dark:text-zinc-200/45')}>{bio ? bio : 'There is no information.'}</p>
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
