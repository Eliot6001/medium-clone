import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "@/context/SupabaseContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SignedInNavbar from "@/components/fullComponents/SignedInNavBar";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Add a title to your article!" })
    .max(100, { message: "Pick a smaller title!" }),
  text: z
    .string()
    .min(100, { message: "Article is a little too small to publish" })
    .trim(),
});



const EditArticle = () => {
  const { id } = useParams();
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const router = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { session } = useSession();
  const [loading, setLoading] = useState(true);
  const RichTextEditor = lazy(() => import('@/components/editor/tiptap'));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      text: "",
    },
  });

  // Fetch article data on mount
  useEffect(() => {
    if (!id || !session) return;

    const fetchArticle = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/articles/${id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (data) {
          // Check if the current user is the author
          if (data.userid !== session.user.id) {
            toast({
              variant: "destructive",
              description: "You are not authorized to edit this article.",
            });
            //router("/articles");
          } else {
            // Populate the form with fetched article data
            form.reset({
              title: data.title,
              text: data.content,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        toast({
          variant: "destructive",
          description: "Error fetching article data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, session, form, router,backendUrl]);

  // Handle form submission: update the article
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(uploadingImage) return;
    try {
      await axios.put(
        `${backendUrl}/articles/edit/${id}`,
        {
          title: values.title,
          content: values.text,
          articleid: id
        },
        {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        }
      );
      toast({
        variant: "success",
        description: "Article updated successfully!",
      });
      router(`/articles/${id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Something went wrong: ${error}`,
      });
      console.error(error);
    }
  }

  if (!session) return <div>Please sign in to edit articles.</div>;
  if (loading) return <div>Loading article data...</div>;

  return (
    <>
      <SignedInNavbar />
      <div className="overflow-x-hidden">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-8 apply-colors-secondary px-10 py-5 h-screen overflow-x-hidden"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Title..."
                      {...field}
                      className="outline-0 ring-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 transition-all duration-150"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Suspense>
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="flex-1 max-h-full">
                  
                  <FormControl>
                    <RichTextEditor
                      description={form.getValues("text")}
                      onChange={field.onChange}
                      setUploadImage={setUploadingImage}
                    />
                  </FormControl>
                  <FormMessage className="py-2 px-2 dark:bg-zinc-500 dark:bg-opacity-25 dark:text-red-400 rounded w-fit" />
                </FormItem>
              )}
            />
          </Suspense>
            <Button type="submit" disabled={uploadingImage}>Update Article</Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditArticle;
