import { useEffect, useState } from "react";
import SignedInNavbar from "@/components/fullComponents/SignedInNavBar";
import supabase from "@/supabaseClient";
import { useSearchParams } from "react-router-dom";
import ArticleCard from "@/components/fullComponents/ArticleCard";
import LoadingPage from "@/components/LoadingPage";
import Article from "@/root/articles/[id]";


//This does the work a little,
//Might wanna expand! 


const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('search_posts_with_user_profile', {
        q: query
      });
      console.log(query)
    
      if (error) {
        console.error('Error searching posts:', error);
        return [];
      }
      console.log("received :", data)
      setArticles(data);
      setLoading(false);

    };

    fetchArticles();
  }, [query]);

  if(loading) return <LoadingPage />
  return (
    <>
      <SignedInNavbar />
      <div className="flex lg:flex-row flex-col-reverse spacep-x-2 apply-colors-primary">
        <main className="flex flex-col container py-5  lg:px-8 px-2  space-y-4  ">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight">
              Found Articles
            </h4>
          {articles.map((article: Article, index) => {
          return (
            <ArticleCard
              key={article.postid || index}
              articleId={article.postid}
              insideProfile={false}
              className="bg-zinc-200 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-all max-w-3/4 w-3/4"
              title={article.title}
              previewText={article.content.replace(/<[^>]*>/g, "").substring(0, 100)}
              authorName={article?.user_profiles?.username }
              authorImage={article?.user_profiles?.avatar_url || "default.webp"}
              authorId={article.userid}
              publishedAt={new Date(article.created_at).toLocaleDateString()}
              rating={article.rating || 0}
              views={article.views || 0}
            />

          );
        })}
        
        </main>
        
      </div>
    </>
  );
};

export default Search;
