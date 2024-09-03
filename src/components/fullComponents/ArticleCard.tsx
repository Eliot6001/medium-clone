import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

//meant to make a smaller overview of article

const ArticleCard = ({insideProfile = true}) => {
  return (
    <Card className="shadow dark:shadow-zinc-800 shadow-zinc-300 lg:w-full w-full">
      {!insideProfile && <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <span>
            <p className="text-primary text-normal">elliot</p>
            <p className="dark:text-zinc-200/50 hover:dark:text-zinc-200/50 hover:text-zinc-900/50 text-zinc-900/50 text-base"> <small> 09:33:35   &#x2022;  03/09/2024</small> </p>
          </span>
        </CardTitle>
      </CardHeader>}
      <CardContent className={cn(" space-y-4 ", insideProfile && "pt-4" )}>
        <h2 className="scroll-m-20 inline-block border-b pb-2 lg:text-2xl text-xl font-semibold tracking-tight first:mt-0 break-words ">
          The People of the Kingdom eagae geageagaegeagaegaegegea
        </h2>
        <p>Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat...</p>
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
