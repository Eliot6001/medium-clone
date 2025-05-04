import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Clock, Heart, Eye } from "lucide-react";

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
  className = "",
  authorName = "Anonymous",
  authorImage = "",
  title,
  previewText,
  imageUrl = "/placeholder-image.jpg",
  articleId,
  rating = 0,
  publishedAt,
  views = 0,
}: ArticleCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/articles/${articleId}`);
  };

  const formattedDate =
    publishedAt instanceof Date
      ? format(publishedAt, "HH:mm • MM/dd/yyyy")
      : "";

  return (
    <Card
      className={cn(
        "shadow-md dark:shadow-zinc-800 shadow-zinc-300 rounded-lg overflow-hidden",
        "w-full",
        "cursor-pointer transition-transform hover:scale-[1.01] duration-200",
        className
      )}
      onClick={handleCardClick}
    >
      {insideProfile && (
        <CardHeader className="px-4 py-3 border-b dark:border-zinc-800">
          <div className="flex flex-row space-x-3 items-center">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={authorImage} alt={authorName} />
              <AvatarFallback>
                {authorName?.[0]?.toUpperCase() ?? "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-xs sm:text-sm overflow-hidden">
              <p className="font-medium text-zinc-700 dark:text-zinc-200 truncate">
                {authorName}
              </p>

              {formattedDate && (
                <p className="dark:text-zinc-400 text-zinc-500 text-xs flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <small className="truncate">{formattedDate}</small>
                </p>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent
        className={cn(
          "w-full flex p-4",
          !insideProfile ? "flex-col" : "md:flex-row md:gap-4 flex-col gap-3"
        )}
      >
        <div
          className={cn(
            "flex flex-col flex-grow",
            !insideProfile ? "w-full" : "md:w-2/3 w-full"
          )}
        >
          <div className="space-y-1.5 flex-grow mb-2">
            <h2
              className={cn(
                "block lg:text-xl text-lg font-semibold tracking-tight break-words",
                "text-zinc-800 dark:text-zinc-100 hover:underline"
              )}
            >
              {title}
            </h2>
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-400 break-words",
                "line-clamp-3"
              )}
            >
              {previewText}
            </p>
          </div>

          <div className="flex items-center space-x-4 select-none text-sm text-zinc-500 dark:text-zinc-400 mt-auto pt-1">
            {" "}
            {/* Push stats down */}
            <div className="flex items-center space-x-1 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
              <Eye className="w-4 h-4" />
              <span>{views}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
              <Heart className="w-4 h-4" />
              <span>{rating}</span>
            </div>
          </div>
        </div>

        {insideProfile && (
          <div className="relative w-full md:w-1/3 h-32 md:h-40 rounded-md overflow-hidden shadow-sm flex-shrink-0">
            {" "}
            {/* Adjusted md height, ensure shrink */}
            <img
              className="absolute inset-0 object-cover w-full h-full transition-transform duration-200 transform hover:scale-105"
              src={imageUrl}
              alt={title}
              loading="lazy"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
