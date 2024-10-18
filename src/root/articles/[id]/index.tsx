
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SignedInNavbar from '@/components/fullComponents/SignedInNavBar';

import '../../../components/editor/styles.scss'

const backendUrl = import.meta.env.VITE_BACKEND_URL;

type Article = {
  title: string;
  content: string;
}

const Article = () => {
  const { id } = useParams();
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
        setError('Failed to load article');
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <SignedInNavbar />
      <main className="px-4 lg:py-16 lg:px-10 md:container py-5">
        {article && (
          <div className="bg-white dark:bg-zinc-800 lg:p-6 px-4 py-4 rounded-lg shadow-md transition-colors duration-150 space-y-12 ">
            <h1 className="text-2xl font-bold mb-4 text-primary dark:text-zinc-200 ">{article.title}</h1>
            <div className="text-xl tiptap " dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        )}
      </main>
    </>
  );
};

export default Article;

