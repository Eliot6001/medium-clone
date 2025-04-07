import { useEffect, useState } from "react";
import SignedInNavbar from "@/components/fullComponents/SignedInNavBar";
import supabase from "@/supabaseClient";
import { useSearchParams } from "react-router-dom";
import ArticleCard from "@/components/fullComponents/ArticleCard";
import LoadingPage from "@/components/LoadingPage";

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
      <main className="flex lg:space-x-6 container py-5 lg:flex-row flex-col">
        {articles.map((article, index) => {
        const excerpt = extractExcerpt(article.content, 100);
        return (
          <ArticleCard
            key={article.postid || index}
            articleId={article.postid}
            insideProfile={false}
            className="bg-zinc-200 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-all duration-150"
            title={article.title}
            previewText={excerpt}
            author={article.author || "Unknown"}
            date={new Date(article.created_at).toLocaleDateString()}
            imageUrl={"https://placehold.co/600x400/EEE/31343C"}
          />
        );
      })}
      </main>
    </>
  );
};

export default Search;
