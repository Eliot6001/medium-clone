import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignedInNavbar from '@/components/fullComponents/SignedInNavBar';
import ProfileData from '@/components/fullComponents/profileData';
import ArticleCard from '@/components/fullComponents/ArticleCard';
import SuggestionCard from '@/components/fullComponents/SuggestionCard';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import LoadingPage from '@/components/LoadingPage';
import { usePopularArticles, Article } from '@/hooks/usePopularArticles';

const backendUrl = import.meta.env.VITE_BACKEND_URL;



interface ProfilePayload {
  username: string;
  website: string;
  avatar_url: string;
  updated_at: string;
  posts: Article[];
}

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
 
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const { articles: popularArticles, loading: loadingPopular } = usePopularArticles(backendUrl, 15);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<ProfilePayload>(
          `${backendUrl}/profiles/${id}`
        );

        if (!data || !data.username) {
          navigate('/404');
          return;
        }

        setProfile(data);
        
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load profile or articles.',
        });
        //navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [id, navigate]);

  if (loading) return <LoadingPage />;
  if (!profile) {
    // just in case
    return (
      <>
        <SignedInNavbar />
        <p className="p-6 text-center">Profile not found.</p>
      </>
    );
  }

  return (
    <>
      <SignedInNavbar />
      <main className="container mx-auto flex flex-col lg:flex-row gap-6 py-5 bg-white dark:bg-zinc-800">
        {/* Profile Card */}
        <div className="w-full lg:w-1/4 space-y-4">
          <div className="bg-gray-200 dark:bg-zinc-700 rounded-lg shadow-lg p-6 border border-gray-300 dark:border-zinc-600">
            <ProfileData
              username={profile.username}
              pfpUrl={profile.avatar_url}
              time_joined={profile.updated_at}
              website={profile.website}
              personal={false}
            />
          </div>
        </div>

        {/* Latest Articles */}
        <div className="flex-1">
          <div className="bg-gray-200 dark:bg-zinc-700 rounded-lg shadow-lg p-6 border border-gray-300 dark:border-zinc-600">
            <h4 className="mb-4 text-xl font-semibold tracking-tight text-primary dark:text-zinc-200 border-b border-gray-300 dark:border-zinc-600 pb-2">
              Latest Articles
            </h4>
            <div className="space-y-4">
              {profile.posts.length > 0 ? (
                profile.posts.map((post) => (
                  <ArticleCard
                    key={post.postid}
                    title={post.title}
                    previewText={post.content.replace(/<[^>]*>/g, "").substring(0, 100)}              
                    articleId={post.postid}
                    rating={post?.rating as number}
                    className="bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 p-4 rounded-lg shadow hover:shadow-lg transition-all"
                    insideProfile
                  />
                ))
              ) : (
                <p className="text-zinc-800 dark:text-zinc-200">
                  No articles found.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related Articles */}
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
                  ratings={article.interaction_count as number}
                  date={article.createdAt as string}
                  imageUrl={'https://placehold.co/600x400/EEE/31343C' as string}

                />
              )) : <div className=" relative "> <LoadingPage className="top-50 left-50"/> </div> }
        </div>
        </div>
      </main>
    </>
  );
};


export default Profile;
