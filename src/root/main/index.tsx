import SignedInNavbar from "@/components/fullComponents/SignedInNavBar";
import ArticleCard from "@/components/fullComponents/ArticleCard";
import SuggestionCard from "@/components/fullComponents/SuggestionCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSession } from "@/context/SupabaseContext";
import { usePopularArticles } from "@/hooks/usePopularArticles";
import LoadingPage from "@/components/LoadingPage";
import type Article from "../articles/[id]";

const Main: React.FC = () => {
  const [suggestedArticles, setSuggestedArticles] = useState<Article[]>([]);
  const { session } = useSession();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
  const { articles: popularArticles, loading: loadingPopular } =
    usePopularArticles(backendUrl, 30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const headers = session?.access_token
          ? { headers: { Authorization: `Bearer ${session.access_token}` } }
          : {};

        const response = await axios.get(
          `${backendUrl}/recommendations/`,
          headers
        );
        setSuggestedArticles(response.data.suggestions.flat());
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
      <main className="container mx-auto px-12 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Feed */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-primary border-b-2 pb-2">
            {session?.access_token ? "Recommendations" : "Latest Articles"}
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingPage />
            </div>
          ) : suggestedArticles.length > 0 ? (
            <div className="space-y-4">
              {suggestedArticles.map((article, idx) => (
                <ArticleCard
                  key={article.postid || idx}
                  articleId={article.postid}
                  insideProfile={false}
                  className="bg-white dark:bg-zinc-900 transition-shadow hover:shadow-lg p-6 rounded-2xl"
                  title={article.title}
                  previewText={article.content
                    .replace(/<([^>]+)>/gi, "")
                    .split(" ")
                    .slice(0, 50)
                    .join(" ") +
                    "..."}
                  authorName={article.user_profiles?.username}
                  authorImage={article.user_profiles?.avatar_url}
                  authorId={article.user_profiles?.id}
                  rating={article.rating}
                  publishedAt={article.created_at}
                  views={article.views}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-16">
              There are no more articles. Time to write some!
            </p>
          )}
        </section>

        {/* Right: Popular */}
        <aside className="space-y-6">
          <h2 className="text-xl font-semibold text-primary border-b pb-1">
            Popular
          </h2>
          {loadingPopular ? (
            <div className="flex justify-center py-6">
              <LoadingPage />
            </div>
          ) : (
            <div className="space-y-4">
              {popularArticles.map((article, idx) => (
                <SuggestionCard
                  key={idx}
                  postid={article.postid}
                  className="bg-white dark:bg-zinc-900 transition-shadow hover:shadow-md p-4 rounded-xl"
                  title={article.title}
                  content={article.content}
                  ratings={typeof article.rating === "number" ? article.rating : 0}
                  date={typeof article.postedat === "string" ? article.postedat.split("T")[0] : ""}
                />
              ))}
            </div>
          )}
        </aside>
      </main>
    </>
  );
};

export default Main;
