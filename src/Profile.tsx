import React from 'react'
import SignedInNavbar from './components/fullComponents/SignedInNavBar'
import ArticleCard from './components/fullComponents/ArticleCard'
import SuggestionCard from './components/fullComponents/SuggestionCard'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Facebook, Github, Instagram, Twitter, X } from 'lucide-react'

const Profile = () => {
  /*User data*/
  /*Recent articles made by user*/
  /*Recent Comments*/
  return (
    <>
      <SignedInNavbar />
      <main className="flex lg:space-x-6 container py-5 lg:flex-row flex-col">
        <div className="w-11/12 lg:w-3/12">
          <Card className="shadow dark:shadow-zinc-800 shadow-zinc-300 w-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
                <span>
                  <p className="text-primary text-normal leading-7 [&:not(:first-child)]:mt-6">elliot</p>
                  <p className="dark:text-zinc-200/50 hover:dark:text-zinc-200/50 hover:text-zinc-900/50 text-zinc-900/50 text-base"> <small>Joined at: 09:33:35   &#x2022;  03/09/2024</small> </p>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0.5">
              <div className="text-lg font-semibold">About</div>
              <p className="text-base leading-7 [&:not(:first-child)]:mt-6">Lorem ipsum dolor sit amet, qui minim labore adipisicing
                minim sint cillum sint consectetur cupidatat...</p>
            </CardContent>
            <CardFooter className="space-x-2 flex items-center select-none">
             <span className="a-secondary"> <Instagram /> </span>
              
              <span className="a-secondary"> <Twitter /> </span>

              <span className="a-secondary"> <Github /> </span>

            </CardFooter>
          </Card>

        </div>
        <div className="flex-1 lg:py-6 lg:px-12 py-4 lg:space-y-5 space-y-3 w-11/12">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight">
            Latest Articles
          </h4>
          <ArticleCard />
          <ArticleCard />
        </div>
        <div className="w-11/12 lg:w-3/12 py-4 lg:space-y-5 space-y-3 ">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight">
            Related Articles
          </h4>
          <SuggestionCard />
        </div>
      </main>
    </>
  )
}

export default Profile  
