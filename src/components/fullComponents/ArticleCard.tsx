import { useNavigate } from "react-router-dom";
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from 'date-fns';
import { Clock, Heart, Eye } from 'lucide-react';

interface ArticleCardProps {
  insideProfile?: boolean;
  className?: string;
  authorName?: string;
  authorImage?: string;
  title: string;
  previewText: string;
  imageUrl?: string;
  articleId: string;
  rating: number;
  publishedAt?: Date;
  views?: number;
}

const ArticleCard = ({
  insideProfile = false,
  className = '',
  authorName = 'Anonymous',
  authorImage = '',
  title,
  previewText,
  imageUrl = '/placeholder-image.jpg',
  articleId,
  rating = 0,
  publishedAt = new Date(),
  views = 0,
}: ArticleCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/articles/${articleId}`);
  };

  const formattedDate = publishedAt ? format(publishedAt, 'HH:mm:ss • MM/dd/yyyy') : '';

  return (
    <Card
      className={cn(
        "shadow-md dark:shadow-zinc-800 shadow-zinc-300 lg:w-full w-full rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.01] duration-150",
        className
      )}
      onClick={handleCardClick}
    >
      {!insideProfile && (
        <CardHeader className="h-14 px-4 py-3">
          <CardTitle className="flex flex-row space-x-3 items-center hover:underline cursor-pointer">
            <Avatar className="w-8 h-8">
              <AvatarImage src={authorImage} alt={authorName} />
              <AvatarFallback>{authorName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="flex flex-col text-xs sm:text-sm">
              <p className="font-medium text-zinc-700 dark:text-zinc-200">{authorName}</p>
              {formattedDate && (
                <p className="dark:text-zinc-400 text-zinc-500 text-xs flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <small>{formattedDate}</small>
                </p>
              )}
            </span>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(
        "w-full flex",
        insideProfile ? "flex-col pt-4" : "md:flex-row flex-col"
      )}>
        <div className={cn("w-full flex flex-col", !insideProfile && "md:pr-4")}>
          <div className="space-y-2 flex-grow"> 
            <h2 className="scroll-m-20 inline-block border-b pb-1 lg:text-xl text-lg font-semibold tracking-tight first:mt-0 break-words lg:h-auto h-auto overflow-hidden hover:underline cursor-pointer text-zinc-800 dark:text-zinc-100">
              {title}
            </h2>
            <p className="lg:h-auto h-auto text-sm text-zinc-600 dark:text-zinc-400 break-words overflow-hidden">
              {previewText}
            </p>
          </div>
          <div className="flex items-center space-x-4 select-none text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            <div className="flex items-center space-x-1 hover:underline cursor-pointer">
              <Eye className="w-4 h-4" />
              <span>{views} Views</span>
            </div>
            <div className="flex items-center space-x-1 hover:underline cursor-pointer">
              <Heart className="w-4 h-4" />
              <span>{rating} Likes</span>
            </div>
          </div>
        </div>
        {!insideProfile && (
          <div className="md:w-1/3 w-full h-full mt-4 md:mt-0">
            <div className="relative w-full h-32 md:h-48 rounded-md overflow-hidden shadow-sm">
              <img
                className="object-cover w-full h-full transition-transform duration-200 transform scale-100 hover:scale-105"
                src={imageUrl}
                alt={title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
            </div>
          </div>
        )}
        {insideProfile && (
          <div className="flex items-center space-x-4 select-none text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            <div className="flex items-center space-x-1 hover:underline cursor-pointer">
              <Eye className="w-4 h-4" />
              <span>{views} Views</span>
            </div>
            <div className="flex items-center space-x-1 hover:underline cursor-pointer">
              <Heart className="w-4 h-4" />
              <span>{rating} Likes</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ArticleCard