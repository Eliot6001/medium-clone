import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { useNavigate } from 'react-router-dom';

interface ArticleCardProps {
  className?: string;
  authorName?: string;
  title: string;
  content: string;
  postid: string;
  ratings: number;
  date: string;
  imageUrl?: string;
}

const ArticleCard = ({ className = "",imageUrl ="", authorName = "", title = "", content = "", postid = "404", ratings = 0, date = 'not given' }: ArticleCardProps) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`/articles/${postid}`)} className={cn("w-full shadow dark:shadow-zinc-800 shadow-zinc-300 cursor-pointer space-y-2 py-2", className)}>
      <CardHeader className="py-2 space-y-2">
        <CardTitle className="text-xl font-semibold tracking-tight break-words">
          {title}
        </CardTitle>
        <small className="text-sm font-medium text-muted-foreground">
          {authorName} {date}
        </small>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-base leading-relaxed">
          {content}
        </p>
      </CardContent>
      <CardFooter className="flex items-center space-x-2 select-none">
        <p className="text-sm text-zinc-900/50 dark:text-zinc-200/50 hover:underline cursor-pointer">
          {ratings} Ratings
        </p>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
