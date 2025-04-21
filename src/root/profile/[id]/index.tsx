
import { useEffect, useState } from 'react';
import SignedInNavbar from '@/components/fullComponents/SignedInNavBar'
import ArticleCard from '@/components/fullComponents/ArticleCard'
import SuggestionCard from '@/components/fullComponents/SuggestionCard'
import ProfileData from '@/components/fullComponents/profileData'
import { useParams } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient'

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const { id } = useParams(); // Get the id from the URL
  const navigate = useNavigate(); // For rerouting to 404
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [date, setDate] = useState('');
  const [posts, setPosts] = useState('');

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        console.log(id)
        const { data, error, status } = await supabase
          .from('user_profiles')
          .select(`
          username,
          website,
          avatar_url,
          updated_at,
          posts (
            post_id,
            title,
            content
          )
        `)
          .eq('id', id) // Use the id from useParams
          .single();

        if (error && status !== 406) {
          toast({
            variant: 'destructive',
            title: 'Failed!',
            description: 'Failed to retrieve data from db!',
            duration: 1500,
          });
          throw error;
        }

        if (!data) {
          navigate('/404'); // Redirect to 404 if no data is found
        } else {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
          setDate(data.updated_at);
          setPosts(data.posts); // Assuming you want to handle the posts as well
        }

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed!',
          description: `Error: ${error}`,
          duration: 1500,
        });
        console.log(error)
        // Redirect to 404 if there's an error
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [id, navigate]); if (loading) return <p>Loading...</p>;

  console.log(posts)
  return (
    <>
      <SignedInNavbar />
      <main className="flex lg:space-x-6 container py-5 lg:flex-row flex-col">
        <div className="w-11/12 lg:w-3/12">
          <ProfileData username={username} pfpUrl={avatarUrl} time_joined={date} website={website} />
        </div>
        <div className="flex-1 lg:py-6 lg:px-12 py-4 lg:space-y-5 space-y-3 w-11/12">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight">
            Latest Articles
          </h4>
          {posts && posts?.map(post => 
          <ArticleCard title={post.title} previewText={post.content.substring(0, 100)} insideProfile />)}
        </div>
        <div className="w-11/12 lg:w-3/12 py-4 lg:space-y-5 space-y-3 ">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight">
            Related Articles
          </h4>
          <SuggestionCard />
        </div>
      </main>
    </>
  )
}

export default Profile  
