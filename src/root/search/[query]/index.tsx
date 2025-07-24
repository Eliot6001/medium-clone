import { useEffect, useState } from "react";
import SignedInNavbar from "@/components/fullComponents/SignedInNavBar";
import supabase from "@/supabaseClient";
import { useSearchParams } from "react-router-dom";
import ArticleCard from "@/components/fullComponents/ArticleCard";
import LoadingPage from "@/components/LoadingPage";
import type Article from "@/root/articles/[id]";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('search_posts_with_user_profile', { q: query });
      if (error) console.error('Error searching posts:', error);
      else setArticles(data || []);
      setLoading(false);
    };
    fetchArticles();
  }, [query]);

  useEffect(() => {
    // trigger fade-out then fade-in
    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timeout);
  }, [view]);

  if (loading) return <LoadingPage />;

  return (
    <>
      <SignedInNavbar />
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-semibold border-b pb-2">Found Articles</h4>
          <div className="space-x-2 md:flex hidden">
            <Button size="sm" variant={view === 'list' ? 'default' : 'outline'} onClick={() => setView('list')}>
              <List className="w-4 h-4" />
            </Button>
            <Button size="sm" variant={view === 'grid' ? 'default' : 'outline'} onClick={() => setView('grid')}>
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div
          className={`transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
          {view === 'list' ? (
            <div className="md:max-w-3xl md:mx-4 md:p-6 space-y-4 w-full">
              {articles.map((article, idx) => (
                <ArticleCard
                  key={article.postid || idx}
                  insideProfile={false}
                  className="bg-white dark:bg-zinc-900 p-6 sm:p-2 rounded-2xl shadow hover:shadow-lg transition"
                  articleId={article.postid}
                  title={article.title}
                  previewText={article.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...'}
                  authorName={article.user_profiles?.username}
                  authorImage={article.user_profiles?.avatar_url || 'default.webp'}
                  authorId={article.userid}
                  publishedAt={article.created_at}
                  rating={article.rating}
                  views={article.views}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, idx) => (
                <ArticleCard
                  key={article.postid || idx}
                  insideProfile={false}
                  className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow hover:shadow-md transition"
                  articleId={article.postid}
                  title={article.title}
                  previewText={article.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...'}
                  authorName={article.user_profiles?.username}
                  authorImage={article.user_profiles?.avatar_url || 'default.webp'}
                  authorId={article.userid}
                  publishedAt={article.created_at}
                  rating={article.rating}
                  views={article.views}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
