import { useParams } from 'react-router-dom';
import SignedInNavbar from '@/components/fullComponents/SignedInNavBar';
import ArticleCard from '@/components/fullComponents/ArticleCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {toast} from '@/components/ui/use-toast';
import { useSession } from '@/context/SupabaseContext';

const DeletedArticles = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const {session} = useSession();
  const [posts, setPosts] = useState<Article[]>([]);
  const [isFetching, setFetching] = useState(true);
 
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await 
        axios.get(`${backendUrl}/profiles/${session?.user.id}/deletedArticles`, {
            headers:{
                Authorization: `Bearer ${session?.access_token}`
            }
        });
        setPosts(data.deletedArticles || []);
      } catch (err) {
        toast({
          variant: 'destructive',
          description: `there was an ${err}`
        })
      } finally {
        setFetching(false);
      }
    };

    fetchArticles();
  }, [session?.user.id, backendUrl]);

  if (isFetching) return <p>Loading...</p>;

  return (
    <>
      <SignedInNavbar />
      <main className="container mx-auto flex flex-col lg:flex-row gap-6 py-5 bg-white dark:bg-zinc-800">
  {/* Profile Card */}

  {/* Latest Articles Card */}
  <div className="flex-1">
    <div className="bg-gray-200 dark:bg-zinc-700 rounded-lg shadow-lg p-6 border border-gray-300 dark:border-zinc-600">
      <h4 className="mb-4 text-xl font-semibold tracking-tight text-primary dark:text-zinc-200 border-b border-gray-300 dark:border-zinc-600 pb-2">
        Removed articles      
        </h4>
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <ArticleCard 
              insideProfile
              key={post.postid} 
              title={post.title} 
              previewText={post.content.substring(0, 100)}
              articleId={post.postid}
              rating={post?.article_ratings?.[0]?.sum}
              className="bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 p-4 rounded-lg shadow hover:shadow-lg transition-all"
            />
          ))
        ) : (
          <p className="text-zinc-800 dark:text-zinc-200">No articles removed.</p>
        )}
      </div>
    </div>
  </div>

</main>


    </>
  );
};

interface Article {
  postid: string;
  title: string;
  userid: string;
  content: string;
  rating?: number; 
  updated_at: Date;
  created_at: Date;
  deleted: boolean;
  deleted_at: Date;
}

export default DeletedArticles;