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
      <main className="flex lg:space-x-6 container py-5 lg:flex-row flex-col">
        <div className="w-11/12 lg:w-3/12">
          <ProfileData username={username} pfpUrl={avatarUrl} time_joined={createdAt} website={website} />
        </div>
        <div className="flex-1 lg:py-6 lg:px-12 py-4 lg:space-y-5 space-y-3 w-11/12">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight">
            Latest Articles
          </h4>
          {posts.length > 0 ? (
        posts.map((post) => (
          <ArticleCard 
          key={post.postid} 
          title={post.title} 
          previewText={post.content.substring(0, 100)}
          articleId={post.postid}
          rating={post?.article_ratings[0]?.sum}
          />
        ))
      ) : (
        <p>No articles found.</p>
      )}
        </div>
        <div className="w-11/12 lg:w-3/12 py-4 lg:space-y-5 space-y-3">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight">
            Related Articles
          </h4>
          <SuggestionCard />
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