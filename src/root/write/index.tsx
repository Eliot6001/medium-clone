import { useState } from 'react';
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { useSession } from '@/context/SupabaseContext';


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import Tiptap from '@/components/editor/tiptap'
import Nav from '@/components/fullComponents/Nav';

import axios from 'axios'
import { toast } from '@/components/ui/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';


const formSchema = z.object({
  title: z.string().min(5, { message: "Add a title to your article!" }).max(100, { message: 'Pick a smaller title!' }),
  text: z.string().min(100, { message: 'Article is a little too small to publish' }).trim(),
})

const Write = () => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      text: '',
    }
  })
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { session } = useSession();
 const navigate = useNavigate();
  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (session) console.log(session, "supabase session")

 

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      if (uploadingImage) return;
      const response = await axios.post(`${backendUrl}/articles/submit`, {
        title: values.title,
        content: values.text
      }, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });

      toast({
        variant: 'success',
        description: `Success!`
      });
      form.reset();
    
      if(response.data) return; //navigate("/main"); 
      
    } catch (error) {
      toast({
        variant: 'destructive',
        description: `Something seems to be wrong: ${error}`
      });
      console.log(error, "Error");
    }
  }

  return (
    <>
      <Nav />
      <div className="overflow-x-hidden ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-8 apply-colors-secondary px-10 py-5 h-screen overflow-x-hidden">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title..."  {...field} className="outline-0 ring-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 transition-all duration-150" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="flex-1  ">
                  <FormControl>
                    <Tiptap description={''} onChange={field.onChange} setUploadImage={setUploadingImage}/>
                  </FormControl>
                  <FormMessage className="py-2 px-2 dark:bg-zinc-500 dark:bg-opacity-25 dark:text-red-400  rounded w-fit" />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={uploadingImage}>Submit</Button>
            {
            uploadingImage && <div className="uploading-indicator">
              <Loader2 className="spin animate-spin"/> Uploading image...</div>
              }

          </form>
        </Form>
          
      </div>
    </>
  );
};

export default Write;
