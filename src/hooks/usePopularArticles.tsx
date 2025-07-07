import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export interface Article {
  postid: string;
  title: string;
  content: string;
  [key: string]: unknown;
}

interface CacheEntry {
  data: Article[];
  expiry: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION =  60 * 1000; // a minute in milliseconds

/**
 * Fetches “popular” articles on mount or when the route changes,
 * strips HTML, truncates to `wordLimit` words, and returns them,
 * utilizing an in-memory cache for 30 minutes.
 */
export function usePopularArticles(
  backendUrl: string,
  wordLimit: number = 30
): { articles: Article[]; loading: boolean; error: string | null } {
  const location = useLocation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheKey = `${backendUrl}/articles/popular?limit=${wordLimit}`; // Unique key based on URL and wordLimit

  useEffect(() => {
    let cancelled = false;

    const fetchPopular = async () => {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = cache.get(cacheKey);
      if (cachedData && Date.now() < cachedData.expiry) {
        if (!cancelled) {
          setArticles(cachedData.data);
          setLoading(false);
        }
        return;
      }

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

        if (!cancelled) {
          setArticles(trimmed);
          // Update the cache
          cache.set(cacheKey, { data: trimmed, expiry: Date.now() + CACHE_DURATION });
        }
      } catch (err: unknown) {
        let message = 'Failed to fetch articles';
        if (err instanceof Error) {
          message = err.message;
        }
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPopular();
    return () => {
      cancelled = true;
    };
  }, [backendUrl, location.pathname, wordLimit, cacheKey]); // Include cacheKey in dependency array

  return { articles, loading, error };
}