import SignedInNavbar from '@/components/fullComponents/SignedInNavBar'
import ArticleCard from '@/components/fullComponents/ArticleCard'
import SuggestionCard from '@/components/fullComponents/SuggestionCard'

//Will be gathering the latest articles and the related articles
//after i build the suggestion system
const Main = () => {

  return (
    <>
    <SignedInNavbar />
    <main className="flex lg:space-x-16 container py-5 lg:flex-row flex-col apply-colors-primary bg-zinc-100 text-zinc-900 h-screen">

      {/* Center Column: Latest Articles */}
      <div className="flex-1 lg:py-6 lg:px-12 py-4 lg:space-y-5 space-y-3 w-11/12">
        <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight text-primary">
          Latest Articles
        </h4>
        <ArticleCard insideProfile={false} className=" bg-zinc-200 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-all duration-150" />
        <ArticleCard insideProfile={false} className="bg-zinc-200 dark:bg-zinc-900  text-gray-900 dark:text-gray-100 transition-all duration-150
"/>
      </div>

      {/* Right Column: Related Articles */}
      <div className="w-11/12 lg:w-3/12 py-4 lg:space-y-5 space-y-3">
        <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight text-primary">
          Related Articles
        </h4>
        <SuggestionCard className="bg-zinc-200 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-all duration-150
"/>
      </div>
    </main>
  </>
  )
}

export default Main
