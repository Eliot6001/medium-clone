import { useEffect, useState } from "react";
import SignedInNavbar from "@/components/fullComponents/SignedInNavBar";
import supabase from "@/supabaseClient";
import { useSearchParams } from "react-router-dom";
import ArticleCard from "@/components/fullComponents/ArticleCard";
import LoadingPage from "@/components/LoadingPage";
import SuggestionCard from '@/components/fullComponents/SuggestionCard'

const backendUrl = import.meta.env.VITE_BACKEND_URL;

//This does the work a little,
//Might wanna expand! 
const extractExcerpt = (htmlContent, length = 100) => {
    // Create a temporary DOM element to leverage the browser's HTML parser.
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
        const { data, error } = await supabase
        .from('posts')
        .select('title, content, postid, userid, created_at')
        .textSearch('fts', query, { type: 'websearch' }); 
    
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
          {articles.map((article, index) => {
          const excerpt = extractExcerpt(article.content, 100);
          return (
            <ArticleCard
              key={article.postid || index}
              articleId={article.postid}
              insideProfile={false}
              className="bg-zinc-200 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-all "
              title={article.title}
              previewText={excerpt}
              author={article.author || "Unknown"}
              date={new Date(article.created_at).toLocaleDateString()}
              imageUrl={"https://placehold.co/600x400/EEE/31343C"}
            />
          );
        })}
        
        </main>
        <div className="lg:w-1/3 lg:space-y-5 space-y-3 lg:p-2 lg:py-5 p-3 py-4">
            <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight">
              Related Articles
            </h4>
            <SuggestionCard />
          </div>
      </div>
    </>
  );
};

export default Search;
