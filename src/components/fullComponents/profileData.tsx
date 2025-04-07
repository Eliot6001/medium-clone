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
    <Card className="w-full shadow-lg border border-gray-300 dark:border-zinc-600 bg-gray-200 dark:bg-zinc-700 rounded-lg overflow-hidden">
    <CardHeader className="px-6 py-4">
      <CardTitle className="flex items-center space-x-4">
        <Avatar url={pfpUrl} size={80} onPublicRoute />
        <div>
          <p className="text-primary text-lg font-semibold leading-7">{username}</p>
          <p className="text-sm text-zinc-900/50 dark:text-zinc-200/50">
            <small>Joined at: {time}</small>
          </p>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent className="px-6 py-4">
      <div className="text-lg font-semibold mb-2">About</div>
      <p className={cn("text-base leading-7", !bio && "text-zinc-900/45 dark:text-zinc-200/45")}>
        {bio ? bio : "There is no information."}
      </p>
      {website && (
        <div className="mt-4">
          <p className="text-sm font-medium">Personal Website:</p>
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {website}
          </a>
        </div>
      )}
    </CardContent>
    <CardFooter className="px-6 py-4 bg-gray-100 dark:bg-zinc-700 flex items-center space-x-3">
      {Socialmedia?.ig && (
        <a
          href={Socialmedia.ig}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-800 dark:text-zinc-200 hover:text-blue-500"
        >
          <Instagram />
        </a>
      )}
      {Socialmedia?.twitter && (
        <a
          href={Socialmedia.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-800 dark:text-zinc-200 hover:text-blue-500"
        >
          <Twitter />
        </a>
      )}
      {Socialmedia?.github && (
        <a
          href={Socialmedia.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-800 dark:text-zinc-200 hover:text-blue-500"
        >
          <Github />
        </a>
      )}
    </CardFooter>
  </Card>
  
  )
}

export default ProfileData
