import SignedInNavbar from "@/components/fullComponents/SignedInNavBar";
import ArticleCard from "@/components/fullComponents/ArticleCard";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingPage from "@/components/LoadingPage";
import axios from "axios";
import FIELDS from '@/components/fields'
import Article from "../articles/[id]";

const Explore = () => {
  const [suggestedArticles, setSuggestedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { search } = useLocation();
  const selectedField = new URLSearchParams(search).get('field');
 const navigate = useNavigate();
  
  
 const handleFieldClick = (field: string) => {
    navigate(`/explore?field=${encodeURIComponent(field)}`);
  };

  
useEffect(() => {
    const fetchSuggestedArticles = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const field = params.get('field');
        const url = `${backendUrl}/articles/explore${field ? `?field=${encodeURIComponent(field)}` : ''}`;
        
        const response = await axios.get(url);
        if (Array.isArray(response.data)) {
          setSuggestedArticles(response.data);
        } else {
          console.error("Invalid response format:", response.data);
          setSuggestedArticles([]);
        }
      } catch (error) {
        console.error("Error fetching suggested articles:", error);
        setSuggestedArticles([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSuggestedArticles();
  }, [selectedField, backendUrl]);


  return (
    <>
      <SignedInNavbar />
      <main className="flex lg:space-x-16 container py-5 lg:flex-row flex-col apply-colors-primary bg-zinc-100 text-zinc-900 ">

        <div className="w-3 lg:w-3/12 py-4 lg:space-y-5 space-y-3 sticky">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2
           font-semibold tracking-tight text-primary apply-colors-primary">
            Fields Articles
          </h4>
          <ul className="space-y-2 float-left block top-0 sticky">
        {FIELDS.map((field: string) => (
          <li
            key={field}
            className={`cursor-pointer px-2 py-1 rounded a-primary font-semibold ${
              selectedField === field ? 'bg-muted font-bold' : ''
            } `}
            onClick={() => handleFieldClick(field)}
          >
            {field}
          </li>
        ))}
      </ul>
        </div>
        {/* Center Column: Latest Articles */}
        <div className="flex-1 lg:py-6 lg:px-12 py-4 lg:space-y-5 space-y-3 w-11/12">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight text-primary">
            Exploring articles
          </h4>
          {!loading ? (
            suggestedArticles.map((article, index) => (
              <ArticleCard
                key={article.postid || index}
                insideProfile={false}
                articleId={article.postid}
                className="bg-zinc-200 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-all duration-150"
                title={article.title}
                previewText={
                  article?.content
                    ? article.content
                        .replace(/(<([^>]+)>)/gi, "")
                        .split(" ")
                        .slice(0, 50)
                        .join(" ") + "..."
                    : ""
                }
                authorName={article.user_profiles?.username}
                authorImage={article.user_profiles?.avatar_url}
                authorId={article.userid}
                publishedAt={article.created_at}
              />
            ))
          ) : (
            <div className=" relative ">
              <LoadingPage className="top-50 left-50" />
            </div>
          )}
          {!loading && suggestedArticles.length === 0 && (
            <span className="w-full dark:border-zinc-700 border-zinc-300 border border-1 p-2 flex rounded-lg">
              <p className="text-base">
                There are no more articles,
                <br />
                How about getting creative?{" "}
              </p>{" "}
            </span>
          )}
        </div>
      </main>
    </>
  );
};

export default Explore;