import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Nav from "@/components/fullComponents/Nav";
import "../../../components/editor/styles.scss";
import RatingComponent from "../../../components/fullComponents/ratingComponent";
import { useSession } from "@/context/SupabaseContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import DeleteWarning from "@/components/modals/alertModal";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export type Article = {
  title: string;
  content: string;
  userid?: string;
};

const Article = () => {
  const { id } = useParams();
  const { session } = useSession();
  const router = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/articles/${id}`);
        setArticle(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load article");
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const RemoveArticle = async () => {
    try {
      if(!session?.access_token) {
        setError("Failed to delete article");
        toast({
          variant: "destructive",
          description: "Session expired",
        });
        return; 
      }
      const {data} = await axios.delete(`${backendUrl}/articles/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if(data)
        router("/main");
    } catch (err) {
      setError("Failed to delete article", err);
      toast({
        variant: "destructive",
        description: "Failed to delete article",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Nav />
      <main className="px-6 lg:py-16 lg:px-10 md:container py-5">
        {article && (
          <>
            <div className="bg-white dark:bg-zinc-800 lg:p-8 p-6 rounded-lg shadow-lg border dark:border-zinc-700 transition-colors duration-150 space-y-6">
              <span className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-primary dark:text-zinc-200">
                  {article.title}
                </h1>
                {article.userid === session?.user?.id && (
                  <span className="flex flex-col items-center space-y-4 bg-gray-100 dark:bg-zinc-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 transition-all">
                    <Button
                      onClick={() => {
                        router(`/articles/edit/${id}`);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                    >
                      Modify
                    </Button>
                    <DeleteWarning
                      onConfirm={RemoveArticle}
                      title="Delete Article"
                      description="Are you sure you want to delete this article?"
                      buttonLabel="Delete"
                      buttonClassName="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
                    />
                  </span>
                )}
              </span>
              <div
                className="text-lg leading-relaxed tiptap text-zinc-800 dark:text-zinc-300"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              <div className="flex items-center justify-start mt-10 ml-auto">
                <div className="bg-gray-100 dark:bg-zinc-800 p-4 lg:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 transition-all w-fit ml-auto">
                  <RatingComponent articleId={id as string} />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Article;
