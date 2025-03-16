import React, { useState, useEffect } from 'react'
import Nav from './components/fullComponents/Nav'
import ArticleCard from './components/fullComponents/ArticleCard'
import SuggestionCard from './components/fullComponents/SuggestionCard'
import ProfileData from './components/fullComponents/profileData'
import { useSession } from './context/SupabaseContext'
import useProfile from './hooks/useProfileData'

const Profile = () => {
  /*User data*/
  /*Recent articles made by user*/
  /*Recent Comments*/
  const { session } = useSession();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const { loading: isFetching, username: fetchedUserName, website: fetchedWebsite, avatarUrl: fetchedavatarUrl, createdAt } = useProfile();

  useEffect(() => {
    setLoading(isFetching);
    if (fetchedUserName) setUsername(fetchedUserName)
    if (fetchedWebsite) setWebsite(fetchedWebsite)
    if (fetchedavatarUrl) setAvatarUrl(fetchedavatarUrl)
  }, [isFetching, fetchedUserName, fetchedWebsite, fetchedavatarUrl])

  return (
    <>
      <Nav />
      <main className="flex lg:space-x-6 container py-5 lg:flex-row flex-col">
        <div className="w-11/12 lg:w-3/12">
          <ProfileData username={username} website={website} pfpUrl={avatarUrl} time_joined={createdAt} />
        </div>
        <div className="flex-1 lg:py-6 lg:px-12 py-4 lg:space-y-5 space-y-3 w-11/12">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight">
            Latest Articles
          </h4>
          <ArticleCard />
          <ArticleCard />
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
