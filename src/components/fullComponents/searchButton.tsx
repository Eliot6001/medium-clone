import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Suspense, useState} from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"

const FormSchema = z.object({
    searchQuery: z.string().min(2, {
    message: "Search Query should be at least 2 letters long.",
  }),
})

const SearchButton = ({className}: {className?: string}) => {
    const navigate = useNavigate();

    const [isExpanded, setExpanded] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      searchQuery: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("send", data.searchQuery)
    navigate(`/search?query=${data.searchQuery}`)
  }

  return (
    <>
    <Suspense>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("w-2/3 space-y-6", className)}>
      
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem>
               <FormControl>
               <div className={cn("flex align-center items-center transition-all duration-150 ease-in relative", 
                !isExpanded && "w-4 pl-0" )}>
                 <Button
                    type="button"
                    onClick={() => setExpanded(!isExpanded)}
                    aria-label={
                      isExpanded ? "Collapse search input" : "Expand search input"
                    }
                    className="absolute left-1 z-10 p-1 focus:outline-none bg-transparent hover:bg-transparent"
                  >
                    <SearchIcon className="h-5 w-5 text-slate-500" />
                  </Button>
                <Input placeholder="Search.." {...field} disabled={!isExpanded} className={cn("pl-8", !isExpanded && "w-0 pl-5 rounded-full")}/>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </form>
    </Form>
    </Suspense>
    </>
  )
}

export default SearchButton

