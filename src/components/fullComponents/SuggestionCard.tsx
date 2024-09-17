import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card'


//meant to make a smaller overview of article
interface ArticleCardProps {
 className?: string;
  authorName?: string | undefined;
  title: string;
}
const ArticleCard = ({className = "", authorName, title =''}: ArticleCardProps) => {
  return (
    <Card className={cn("shadow dark:shadow-zinc-800 shadow-zinc-300 w-full", className )}>
      <CardContent className="pt-4 pb-2">
        <p className=" pb-2 text-base font-semibold tracking-tight m-0 text-wrap break-words">
          {title}
        </p>
     <small className="text-sm font-medium leading-none text-muted-foreground ">{authorName}</small>
      </CardContent>
      <CardFooter className="space-x-2 flex items-center select-none">
        <p className="hover:underline cursor-pointer dark:text-zinc-200/50 hover:dark:text-zinc-200/50 hover:text-zinc-900/50 text-zinc-900/50 text-sm">150 Views </p>
        <p>  &#x2022;</p>
        <p className="hover:underline cursor-pointer dark:text-zinc-200/50 hover:dark:text-zinc-200/50 hover:text-zinc-900/50 text-zinc-900/50 text-sm">150 Comments</p>
      </CardFooter>
    </Card>
  )
}

export default ArticleCard
