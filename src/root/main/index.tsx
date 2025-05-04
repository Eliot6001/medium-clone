import SignedInNavbar from "@/components/fullComponents/SignedInNavBar";
import ArticleCard from "@/components/fullComponents/ArticleCard";
import SuggestionCard from "@/components/fullComponents/SuggestionCard";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSession } from "@/context/SupabaseContext";
import { usePopularArticles } from "@/hooks/usePopularArticles";
import LoadingPage from "@/components/LoadingPage";

const Main = () => {
  const [suggestedArticles, setsuggestedArticles] = useState([]);
  const { session } = useSession();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
  const { articles: popularArticles, loading: loadingPopular } =
    usePopularArticles(backendUrl, 30);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const config = session?.access_token
          ? { headers: { Authorization: `Bearer ${session.access_token}` } }
          : {};
  
        const response = await axios.get(`${backendUrl}/recommendations/`, config);
  
        setsuggestedArticles(response.data.suggestions);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSuggestions();
  }, [backendUrl, location.pathname, session?.access_token]);

  return (
    <>
      <SignedInNavbar />
      <main className="flex lg:space-x-16 container py-5 lg:flex-row flex-col apply-colors-primary bg-zinc-100 text-zinc-900 ">
        {/* Center Column: Latest Articles */}
        <div className="flex-1 lg:py-6 lg:px-12 py-4 lg:space-y-5 space-y-3 w-11/12">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight text-primary">
            Latest Articles
          </h4>
            {!loading ? (
            (suggestedArticles as Array<{
              postid: string;
              title: string;
              content: string;
              author: string;
              postedat: string;
            }>).map((article, index) => (
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
              //@ts-ignore
              author={article.author}
              date={article.postedat}
              imageUrl={"https://placehold.co/600x400/EEE/31343C"}
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

        {/* Right Column: Related Articles */}
        <div className="w-11/12 lg:w-3/12 py-4 lg:space-y-5 space-y-3 ">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight text-primary">
            Related Articles
          </h4>
          {!loadingPopular ? (
            popularArticles.map((article, index) => (
              <SuggestionCard
                key={index}
                postid={article.postid}
                className="bg-zinc-200 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-all duration-150"
                title={article.title}
                content={article.content}
                ratings={typeof article.rating === "number" ? article.rating : 0}
                date={
                  typeof article.postedat === "string"
                    ? article.postedat.split("T")[0]
                    : ""
                }
              />
            ))
          ) : (
            <div className=" relative ">
              {" "}
              <LoadingPage className="top-50 left-50" />{" "}
            </div>
          )}
        </div>
      </main>
    </>
  );
};



export default Main;
