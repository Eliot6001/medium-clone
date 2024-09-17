import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

//meant to make a smaller overview of article

interface ArticleCardProps {
  insideProfile?: boolean;
  className?: string;
  authorName?: string | undefined;
  authorImage?: string | undefined;
  title: string;
  previewText: string;
  imageUrl?: string;
  /*rating?: {
   * comments?: number;
   * likes?: number;
   * }*/
}

const ArticleCard = ({ insideProfile = true, className = '', authorName = 'Anon', authorImage, title, previewText, imageUrl }: ArticleCardProps) => {

  return (
    <Card className={cn("shadow dark:shadow-zinc-800 shadow-zinc-300 lg:w-full w-full", className)}>
      {!insideProfile && <CardHeader className="h-16">
        <CardTitle className="flex flex-row space-x-2 items-center">
          <Avatar className="w-8 h-8">
            <AvatarImage src={authorImage} />
            <AvatarFallback>{authorName[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="flex space-x-2 items-center justify-center">
            <p className=" text-sm">{authorName}</p>
            <p className="dark:text-zinc-200/50 hover:dark:text-zinc-200/50 hover:text-zinc-900/50 text-zinc-900/50 text-base"> <small> 09:33:35   &#x2022;  03/09/2024</small> </p>
          </span>
        </CardTitle>
      </CardHeader>
      }
      <CardContent className={cn("w-full flex items-start justify-start", insideProfile && "pt-4")}>
        <div className="w-full "  > {/*Text section*/}
          <h2 className="scroll-m-20 inline-block border-b pb-2 lg:text-2xl text-xl font-semibold tracking-tight first:mt-0 break-words lg:h-full h-16 overflow-hidden">
            {title}
          </h2>
          <p className="lg:h-full h-10 break-words overflow-hidden">{previewText}</p>
          <span className="space-x-2 flex items-center select-none"> <p className="hover:underline cursor-pointer dark:text-zinc-200/50 hover:dark:text-zinc-200/50 hover:text-zinc-900/50 text-zinc-900/50 text-sm">150 Views </p>
            <p>  &#x2022;</p>
            <p className="hover:underline cursor-pointer dark:text-zinc-200/50 hover:dark:text-zinc-200/50 hover:text-zinc-900/50 text-zinc-900/50 text-sm">150 Comments</p>
          </span>
        </div>
        {!insideProfile &&
          <div className="lg:w-1/4 md:w-1/2 w-full h-full mt-0">
            <img className="object-contain" src={imageUrl} />
          </div>
        }
      </CardContent>
    </Card>
  )
}

export default ArticleCard
