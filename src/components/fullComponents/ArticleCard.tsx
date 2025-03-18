import { useNavigate } from "react-router-dom";

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
  articleId: string; // Add articleId to props
  rating: number;
}

const ArticleCard = ({ 
  insideProfile = true, 
  className = '', 
  authorName = 'Anon', 
  authorImage, 
  title, 
  previewText, 
  imageUrl, 
  articleId,
  rating = 0
}: ArticleCardProps) => {
  const navigate = useNavigate();


  const handleCardClick = () => {
      navigate(`/articles/${articleId}`); // Navigate to the article page
  };

  return (
    <Card 
      className={cn("shadow-lg dark:shadow-zinc-800 shadow-zinc-300 lg:w-full w-full rounded-lg overflow-hidden cursor-pointer", className)} 
      onClick={handleCardClick} // Add onClick handler
    >
      {!insideProfile && (
        <CardHeader className="h-16 px-4 py-3">
          <CardTitle className="flex flex-row space-x-3 items-center hover:underline cursor-pointer">
            <Avatar className="w-9 h-9">
              <AvatarImage src={authorImage} />
              <AvatarFallback>{authorName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="flex flex-col">
              <p className="text-sm font-medium">{authorName}</p>
              <p className="dark:text-zinc-400 text-zinc-500 text-xs">
                <small>09:33:35 &#x2022; 03/09/2024</small>
              </p>
            </span>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("w-full flex items-start justify-start px-4 py-4", insideProfile && "pt-4")}>
        <div className="w-full space-y-2"> {/* Text section */}
          <h2 className="scroll-m-20 inline-block border-b pb-2 lg:text-2xl text-xl font-semibold tracking-tight first:mt-0 break-words lg:h-full h-16 overflow-hidden hover:underline cursor-pointer">
            {title}
          </h2>
          <p className="lg:h-full h-10 text-sm text-zinc-600 dark:text-zinc-400 break-words overflow-hidden">
            {previewText}
          </p>
          <span className="space-x-2 flex items-center select-none text-sm text-zinc-500 dark:text-zinc-400">
            <p className="hover:underline cursor-pointer">150 Views</p>
            <p>&#x2022;</p>
            <p className="hover:underline cursor-pointer">{rating} likes</p>
          </span>
        </div>
        {!insideProfile && (
          <div className="lg:w-1/4 md:w-1/2 w-full h-full mt-0 pl-4">
            <img className="object-cover rounded-md shadow-sm" src={imageUrl} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ArticleCard
