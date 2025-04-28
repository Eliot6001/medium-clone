import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

interface Article {
  postid: string;
  title: string;
  content: string;
  [key: string]: any;
}

/**
 * Fetches “popular” articles on mount or when the route changes,
 * strips HTML, truncates to `wordLimit` words, and returns them.
 */
export function usePopularArticles(
  backendUrl: string,
  wordLimit: number = 30
): { articles: Article[]; loading: boolean; error: string | null } {
  const location = useLocation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchPopular = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get<Article[]>(
          `${backendUrl}/articles/popular`
        );
        if (cancelled) return;

        const trimmed = data.map((article) => {
          const text = article.content
            .replace(/(<([^>]+)>)/gi, '')
            .split(' ')
            .slice(0, wordLimit)
            .join(' ');
          return { ...article, content: text + '...' };
        });
     
        setArticles(trimmed);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to fetch articles');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPopular();
    return () => {
      cancelled = true;
    };
    
  }, [backendUrl, location.pathname, wordLimit]);

  return { articles, loading, error };
}
