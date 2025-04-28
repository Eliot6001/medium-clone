import { useLocation, useParams } from 'react-router-dom';
import SignedInNavbar from '@/components/fullComponents/SignedInNavBar';
import ArticleCard from '@/components/fullComponents/ArticleCard';
import SuggestionCard from '@/components/fullComponents/SuggestionCard';
import ProfileData from '@/components/fullComponents/profileData';
import { useProfile } from '../../hooks/useProfileData'; // Adjust path as needed
import { useEffect, useState } from 'react';
import axios from 'axios';
import {toast} from '@/components/ui/use-toast';
import { useSession } from '../../context/SupabaseContext';
import {  History, SettingsIcon, X } from 'lucide-react';
import IconLink from '../../components/fullComponents/IconLink';
import { usePopularArticles } from '@/hooks/usePopularArticles';
import LoadingPage from '@/components/LoadingPage';

/*The logged in user's profile! */
const Profile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { id } = useParams();
  const {session} = useSession();
  const [posts, setPosts] = useState<Article[]>([]);
  const [_, setFetching] = useState(true);
  const { loading, username, website, avatarUrl, createdAt } = useProfile();
  const { articles: popularArticles, loading: loadingPopular } = usePopularArticles(backendUrl, 15);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/profiles/${session?.user.id}/articles`);
        data.articles.forEach((article: {content: string}) => {
          article.content = article.content.replace(/(<([^>]+)>)/gi, "").split(' ').slice(0,49).join(' ').concat("...");
        });
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
  <div className="w-full lg:w-1/4 space-y-4">
    <div className="bg-gray-200 dark:bg-zinc-700 rounded-lg shadow-lg p-6 border border-gray-300 dark:border-zinc-600">
      <ProfileData 
        username={username} 
        pfpUrl={avatarUrl} 
        time_joined={createdAt} 
        website={website} 
      />
  
    </div>
    <div className="bg-gray-200 dark:bg-zinc-700 flex flex-row space-x-2 rounded-full shadow-lg p-1 border border-gray-300 dark:border-zinc-600">
      <IconLink  href="/account" > <SettingsIcon size={24} /> </IconLink>
      <IconLink href="/articles/deleted"  > <X size={24} /> </IconLink>
      <IconLink href="/articles/history" > <History size={24} /> </IconLink>
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
    <div className="bg-gray-200 dark:bg-zinc-700 rounded-lg shadow-lg p-6 border border-gray-300 dark:border-zinc-600 space-y-8">
      <h4 className="mb-4 text-xl font-semibold tracking-tight text-primary dark:text-zinc-200 border-b border-gray-300 dark:border-zinc-600 pb-2">
      Popular Articles
      </h4>
      {!loadingPopular ? popularArticles.map((article, index) => (
            <SuggestionCard 
              key={index}
              postid={article.postid}
              className="bg-zinc-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 transition-all duration-150"
              title={article.title}
              content={article.content}
              ratings={article.interaction_count}
              date={new Date(article.postedat).toISOString().split('T')[0]}
              imageUrl={'https://placehold.co/600x400/EEE/31343C'}
            />
          )) : <div className=" relative "> <LoadingPage className="top-50 left-50"/> </div> }
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