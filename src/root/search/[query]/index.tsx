import { useEffect, useState } from "react";
import SignedInNavbar from "@/components/fullComponents/SignedInNavBar";
import supabase from "@/supabaseClient";
import { useSearchParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
        const { data, error } = await supabase
        .from('posts')
        .select('*')
        .textSearch('fts', query, { type: 'websearch' }); 
    
      if (error) {
        console.error('Error searching posts:', error);
        return [];
      }
      console.log("received :", data)
      setArticles(data);
    };

    fetchArticles();
  }, [query]);

  return (
    <>
      <SignedInNavbar />
      <main className="flex lg:space-x-6 container py-5 lg:flex-row flex-col">
        {query}
      </main>
    </>
  );
};

export default Search;
