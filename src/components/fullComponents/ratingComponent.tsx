import { useEffect, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "../ui/use-toast";
import axios from "axios";
import { useSession } from "@/context/SupabaseContext";
import { cn } from "@/lib/utils";


const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * RatingComponent is a React functional component that allows users to rate an article.
 * It fetches the current rating data for the article and allows the user to rate it up or down.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.articleId - The ID of the article to be rated.
 * 
 * @returns {JSX.Element} The rendered RatingComponent.
 * 
 * @example
 * <RatingComponent articleId="12345" />
 * 
 * @remarks
 * This component uses the `useSession` hook to get the current user session and the `useState` and `useEffect` hooks to manage state and side effects.
 * It also uses the `useCallback` hook to memoize the rating handler function.
 * 
 * The component optimistically updates the UI before sending the rating request to the backend.
 * It also handles loading state to prevent spam clicking and displays toast notifications for success and error messages.
 */
const RatingComponent = ({ articleId }: { articleId: string }) => {
  const { session } = useSession();
  const userId = session?.user.id;
  const [ratingData, setRatingData] = useState<{
    total_count: number;
    total_rating: number;
    user_rating: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(false); // Prevent spam clicking

  useEffect(() => {
    

    const fetchRating = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/articles/rate-article`, {
          params: { articleId, userId },
        });
        setRatingData(data);
      } catch (error) {
        console.error("Error fetching article rating:", error);
      }
    };

    fetchRating();
  }, [articleId, userId, session]);

 
  // Optimized rating handler
  const RatingHandler = useCallback(
    async (ratingValue: number) => {
      if (loading) return; // Prevent spam clicking
      setLoading(true);

      const newRating = ratingData?.user_rating === ratingValue ? 0 : ratingValue;

      try {
        // Optimistically update UI before sending request
        if(session?.user.id === undefined) {
          toast({
            variant: "destructive",
            description: "You must be signed in to rate an article!", 
          });
          return;
        }
        setRatingData((prev) =>
          prev
            ? {
                ...prev,
                user_rating: newRating,
                total_rating:
                  prev.total_rating - (prev.user_rating || 0) + newRating,
              }
            : prev
        );

        const response = await axios.post(
          `${backendUrl}/articles/rate-article`,
          {
            user_id: userId,
            article_id: articleId,
            rating: newRating,
          },
          { headers: { Authorization: `Bearer ${session?.access_token}` } }
        );

        if (response.status === 200) {
          toast({
            variant: "success",
            color: newRating === 0 ? "gray" : newRating > 0 ? "green" : "red",
            description:
              newRating === 0
                ? "You removed your rating!"
                : newRating > 0
                ? "You rated this article up!"
                : "You rated this article down!",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to submit the rating. Try again later!",
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [loading, ratingData, userId, articleId, session]
  );

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="outline"
        className={cn(
          "btn-primary rounded-full transition-all text-primary active:scale-95",
          ratingData?.user_rating === 1 ? "bg-green-500 text-white" : "btn-secondary"
        )}
        onClick={() => RatingHandler(1)}
        disabled={loading}
      >
        <ThumbsUp size={20} />
      </Button>

      <p className="text-lg font-medium">{ratingData?.total_rating ?? 0}</p>

      <Button
        variant="outline"
        className={cn(
          "rounded-full transition-all text-primary active:scale-95",
          ratingData?.user_rating === -1 ? "bg-red-500 text-white" : "bg-red-400"
        )}
        onClick={() => RatingHandler(-1)}
        disabled={loading}
      >
        <ThumbsDown size={20} />
      </Button>
    </div>
  );
};

export default RatingComponent;
