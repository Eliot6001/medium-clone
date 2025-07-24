
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Suspense } from 'react';

interface SuggestionCardProps {
  className?: string;
  title: string;
  content: string;
  postid: string;
  ratings: number;
  date?: string;
}

const SuggestionCard = ({
  className = "",
  title = "",
  content = "",
  postid = "404",
  ratings = 0,
  date = ''
}: SuggestionCardProps) => {
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
      <Card
        onClick={() => navigate(`/articles/${postid}`)}
        className={cn(
          "w-full shadow dark:shadow-zinc-800 shadow-zinc-300 cursor-pointer overflow-hidden transition-transform hover:scale-102",
          className
        )}
      >
        <CardHeader className="px-4 py-3 border-b dark:border-zinc-800">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-2">
            {title}
          </h3>
          {formattedDate && <small className="text-xs text-muted">{formattedDate}</small>}
        </CardHeader>
        <CardContent className="px-4 py-2">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {content}
          </p>
        </CardContent>
        <CardFooter className="px-4 py-2 flex justify-between items-center">
          <span className="text-sm text-zinc-900/50 dark:text-zinc-200/50">
            {ratings} Ratings
          </span>
        </CardFooter>
      </Card>
    </Suspense>
  );
};

export default SuggestionCard;

