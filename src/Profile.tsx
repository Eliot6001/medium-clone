import { useParams } from 'react-router-dom';
import SignedInNavbar from '@/components/fullComponents/SignedInNavBar';
import ArticleCard from '@/components/fullComponents/ArticleCard';
import SuggestionCard from '@/components/fullComponents/SuggestionCard';
import ProfileData from '@/components/fullComponents/profileData';
import { useProfile } from './hooks/useProfileData'; // Adjust path as needed
import { useEffect, useState } from 'react';
import axios from 'axios';
import {toast} from '@/components/ui/use-toast';
import { useSession } from './context/SupabaseContext';

const Profile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { id } = useParams();
  const {session} = useSession();
  const [posts, setPosts] = useState<Article[]>([]);
  const [_, setFetching] = useState(true);
  const { loading, username, website, avatarUrl, createdAt } = useProfile();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/profiles/${session?.user.id}/articles`);
        setPosts(data.articles || []);
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

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <SignedInNavbar />
      <main className="container mx-auto flex flex-col lg:flex-row gap-6 py-5 bg-white dark:bg-zinc-800">
  {/* Profile Card */}
  <div className="w-full lg:w-1/4">
    <div className="bg-gray-200 dark:bg-zinc-700 rounded-lg shadow-lg p-6 border border-gray-300 dark:border-zinc-600">
      <ProfileData 
        username={username} 
        pfpUrl={avatarUrl} 
        time_joined={createdAt} 
        website={website} 
        
      />
    </div>
  </div>

  {/* Latest Articles Card */}
  <div className="flex-1">
    <div className="bg-gray-200 dark:bg-zinc-700 rounded-lg shadow-lg p-6 border border-gray-300 dark:border-zinc-600">
      <h4 className="mb-4 text-xl font-semibold tracking-tight text-primary dark:text-zinc-200 border-b border-gray-300 dark:border-zinc-600 pb-2">
        Latest Articles
      </h4>
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <ArticleCard 
              key={post.postid} 
              title={post.title} 
              previewText={post.content.substring(0, 100)}
              articleId={post.postid}
              rating={post?.article_ratings?.[0]?.sum}
              className="bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 p-4 rounded-lg shadow hover:shadow-lg transition-all"
            />
          ))
        ) : (
          <p className="text-zinc-800 dark:text-zinc-200">No articles found.</p>
        )}
      </div>
    </div>
  </div>

  {/* Related Articles Card */}
  <div className="w-full lg:w-1/4">
    <div className="bg-gray-200 dark:bg-zinc-700 rounded-lg shadow-lg p-6 border border-gray-300 dark:border-zinc-600">
      <h4 className="mb-4 text-xl font-semibold tracking-tight text-primary dark:text-zinc-200 border-b border-gray-300 dark:border-zinc-600 pb-2">
        Related Articles
      </h4>
      <SuggestionCard 
        className="bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 p-4 rounded-lg shadow hover:shadow-lg transition-all" 
      />
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

export default Profile;