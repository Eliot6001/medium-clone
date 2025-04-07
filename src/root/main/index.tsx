import SignedInNavbar from '@/components/fullComponents/SignedInNavBar'
import ArticleCard from '@/components/fullComponents/ArticleCard'
import SuggestionCard from '@/components/fullComponents/SuggestionCard'

const Main = () => {
  const dummyArticles = [
    {
      title: "The Art of Modern Development",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      author: "John Doe",
      date: "Oct 15, 2023",
    },
    {
      title: "Understanding TypeScript in 2023",
      excerpt: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
      author: "Jane Smith",
      date: "Oct 14, 2023",
    },
    {
      title: "React Best Practices",
      excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.",
      author: "Mike Johnson",
      date: "Oct 13, 2023",
    },
  ];

  const suggestedArticles = [
    {
      title: "Getting Started with Next.js",
      excerpt: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.",
      author: "Sarah Wilson",
      date: "Oct 12, 2023",
    },
    {
      title: "Web Development Trends",
      excerpt: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.",
      author: "Tom Brown",
      date: "Oct 11, 2023",
    },
  ];

  return (
    <>
      <SignedInNavbar />
      <main className="flex lg:space-x-16 container py-5 lg:flex-row flex-col apply-colors-primary bg-zinc-100 text-zinc-900 h-screen">
        {/* Center Column: Latest Articles */}
        <div className="flex-1 lg:py-6 lg:px-12 py-4 lg:space-y-5 space-y-3 w-11/12">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight text-primary">
            Latest Articles
          </h4>
          {dummyArticles.map((article, index) => (
            <ArticleCard 
              key={index}
              insideProfile={false}
              className="bg-zinc-200 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-all duration-150"
              title={article.title}
              previewText={article.excerpt}
              author={article.author}
              date={article.date}
              imageUrl={'https://placehold.co/600x400/EEE/31343C'}
            />
          ))}
        </div>

        {/* Right Column: Related Articles */}
        <div className="w-11/12 lg:w-3/12 py-4 lg:space-y-5 space-y-3">
          <h4 className="scroll-m-20 text-xl border-b border-b-0.5 pb-2 font-semibold tracking-tight text-primary">
            Related Articles
          </h4>
          {suggestedArticles.map((article, index) => (
            <SuggestionCard 
              key={index}
              className="bg-zinc-200 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-all duration-150"
              title={article.title}
              previewText={article.excerpt}
              author={article.author}
              date={article.date}
              imageUrl={'https://placehold.co/600x400/EEE/31343C'}
            />
          ))}
        </div>
      </main>
    </>
  )
}

export default Main
