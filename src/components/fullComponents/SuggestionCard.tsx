import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Suspense } from 'react';

interface ArticleCardProps {
  className?: string;
  authorName?: string;
  title: string;
  content: string;
  postid: string;
  ratings: number;
  date?: string;
  imageUrl?: string;
}

const ArticleCard = ({ className = "", title = "",
   content = "", postid = "404", ratings = 0, date = 'not given' }: ArticleCardProps) => {
  const navigate = useNavigate();
   let formattedDate;
if (date) {
  const parsed = new Date(date);
  if (!isNaN(parsed.getTime())) {
    formattedDate = format(parsed, "HH:mm • MM/dd/yyyy");
  }
}
  
  return (
    <Suspense>
    <Card onClick={() => navigate(`/articles/${postid}`)} className={cn("w-full shadow dark:shadow-zinc-800 shadow-zinc-300 cursor-pointer ", className)}>
      
      <CardHeader className="p-5 pb-0">
        <CardTitle className="text-base font-semibold tracking-tight break-words">
          {title}
        </CardTitle>
        <small className="text-sm">
          {formattedDate}
        </small>
      </CardHeader>
      <CardContent className="py-1 mt-2">
        <p className="text-sm leading-relaxed">
          {content}
        </p>
      </CardContent>
      <CardFooter className="flex items-center select-none">
        <p className="text-sm text-zinc-900/50 dark:text-zinc-200/50 hover:underline cursor-pointer">
          {ratings} Ratings
        </p>
      </CardFooter>

    </Card>
    </Suspense>
  );
};

export default ArticleCard;
