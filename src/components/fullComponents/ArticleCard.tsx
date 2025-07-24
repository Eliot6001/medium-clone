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
  authorId = "",
  title,
  previewText,
  articleId,
  rating = 0,
  publishedAt,
  views = 0,
}: ArticleCardProps) => {
  const navigate = useNavigate();
  const handleCardClick = () => navigate(`/articles/${articleId}`);
  let formattedDate;
  if (publishedAt) {
    const parsed = new Date(publishedAt);
    if (!isNaN(parsed.getTime())) {
      formattedDate = format(parsed, "HH:mm • MM/dd/yyyy");
    }
  }

  return (
    <Suspense>
      <Card
        onClick={handleCardClick}
        className={cn(
          "shadow-md dark:shadow-zinc-800 shadow-zinc-300 overflow-hidden cursor-pointer transition-transform hover:scale-102",
          "w-full",
          className
        )}
      >
        {!insideProfile && (
          <CardHeader className="px-4 py-3 border-b dark:border-zinc-800">
            <Link
              to={`/profile/${authorId}`} className="flex items-center space-x-3"
            >
              <Avatar url={authorImage} size={28} onPublicRoute />
              <div className="flex flex-col text-sm truncate justify-center">
                <p className="font-medium text-zinc-700 dark:text-zinc-200 truncate">
                  {authorName}
                </p>
                {formattedDate && (
                  <p className="text-xs flex items-center space-x-1 text-zinc-500">
                    <Clock className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </p>
                )}
              </div>
            </Link>
          </CardHeader>
        )}
        <CardContent className="p-2 flex flex-col space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-2">
            {title}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
            {previewText}
          </p>
          <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 mt-auto">
            <div className="flex items-center space-x-1">
              <Eye className="w-5 h-5" /> <span>{views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-5 h-5" /> <span>{rating}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Suspense>
  );
};

export default ArticleCard;
