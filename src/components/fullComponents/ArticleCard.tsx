import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "../ui/card";
import Avatar from "@/Avatar";
import { format } from "date-fns";
import { Clock, Heart, Eye } from "lucide-react";
import { Suspense } from "react";

interface ArticleCardProps {
  insideProfile?: boolean;
  className?: string;
  authorName?: string;
  authorImage?: string;
  authorId?: string;
  title: string;
  previewText: string;
  articleId?: string;
  rating?: number;
  publishedAt?: string;
  views?: number;
}

const ArticleCard = ({
  insideProfile = false,
  className = "",
  authorName = "Anonymous",
  authorImage = "default.webp",
  authorId = '',
  title,
  previewText,
  articleId,
  rating = 0,
  publishedAt,
  views = 0,
}: ArticleCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/articles/${articleId}`);
  };

  const formattedDate = publishedAt && 
     format(publishedAt, "HH:mm • MM/dd/yyyy")
      || "";

  return (
    <Suspense>
    <Card
      className={cn(
        "shadow-md dark:shadow-zinc-800 shadow-zinc-300 rounded-lg overflow-hidden",
        "w-full",
        "cursor-pointer transition-transform hover:scale-[1.01] duration-200 z-10",
        className
      )}

      onClick={handleCardClick}
    >
      {!insideProfile && (
        <CardHeader className="px-4 py-3 border-b dark:border-zinc-800">
          <div className="">
          <Link to={`/profile/${authorId}`} className="flex flex-row space-x-3 items-center z-20">
            <Avatar url={authorImage as string} size={28} onPublicRoute />
            <div className="flex flex-col text-xs sm:text-sm overflow-hidden">
              <p className="font-medium text-zinc-700 dark:text-zinc-200 truncate">
                {authorName ? authorName : "No Username."}
              </p>
              {formattedDate && (
                <p className="dark:text-zinc-400 text-zinc-500 text-xs flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <small className="truncate">{formattedDate}</small>
                </p>
              )}
            </div>
          </Link>
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

        
      </CardContent>
    </Card>
    </Suspense>
  );
};

export default ArticleCard;
