/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Nav from "@/components/fullComponents/Nav";
import "../../../components/editor/styles.scss";
import RatingComponent from "../../../components/fullComponents/ratingComponent";
import { useSession } from "@/context/SupabaseContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import DeleteWarning from "@/components/modals/alertModal";
import LoadingPage from "@/components/LoadingPage";
import useProfile from "@/hooks/useProfileData";
import { cn } from "@/lib/utils";
import ProfileData from "@/components/fullComponents/profileData";
import Avatar from "@/Avatar";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export type Article = {
  title: string;
  content: string;
  userid?: string;
  deleted?: boolean;
  // Added moderation fields:
  reason?: string;
  removalBy?: string;
  removalId?: string;
  isCategorized?: boolean;
};

const Article = () => {
  const { id } = useParams();
  const { session } = useSession();
  const { ROLE } = useProfile(session?.access_token);
  const router = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [Summary, setSummary] = useState("");
  const [fetchedSummary, setFetchedSummary] = useState<boolean>(false);

  // Refs for engagement tracking
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timersRef = useRef<(ReturnType<typeof setTimeout> | null)[]>([]);
  const engagedSegmentsRef = useRef<boolean[]>([]);
  // For batching: store engaged segments in a Set, and hold a batch timer
  const engagementBatchRef = useRef<Set<number>>(new Set());
  const batchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isViewLogged = useRef(false);
  const fetchSummary = async () => {
    if (!article || article?.isCategorized !== true || fetchedSummary) return; // Simplify the condition

    try {
      const { data } = await axios.get(
        `${backendUrl}/articles/summary?postid=${id}`
      );
      if (data?.summary?.length > 0) {
        setSummary(data.summary);
      } else {
        setSummary("There isn't a summary.");
      }
      setFetchedSummary(true);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setFetchedSummary(true);
    }
  };

  useEffect(() => {
    if (isViewLogged.current || loading || !article || !session?.user?.id)
      return;

    // Send view history request
    axios
      .post(
        `${backendUrl}/profiles/history/`,
        {
          postid: id,
          userid: session.user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      )
      .then(() => {
        console.log("View recorded in history table");
      })
      .catch((error) => {
        console.error("Failed to record view:", error);
      });
  }, [loading, article, session?.user?.id, id]);

  useEffect(() => {
    markerRefs.current = Array(5).fill(null);
    timersRef.current = Array(5).fill(null);
    engagedSegmentsRef.current = Array(5).fill(false);
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/articles/${id}`, {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });
        setArticle(data);
        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 410) {
            setError("This article has been removed.");
          } else {
            setError("Failed to load article");
          }
        } else {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id, session]);

  useEffect(() => {
    if (loading || !article) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const markerIndex = markerRefs.current.findIndex(
          (el) => el === entry.target
        );
        if (markerIndex === -1) return;

        if (entry.isIntersecting && !engagedSegmentsRef.current[markerIndex]) {
          if (!timersRef.current[markerIndex]) {
            console.log("Setting timeout for marker:", markerIndex);
            timersRef.current[markerIndex] = setTimeout(() => {
              console.log("Engagement reached for marker:", markerIndex);
              engagedSegmentsRef.current[markerIndex] = true;
              engagementBatchRef.current.add(markerIndex);
              // If all segments are engaged, flush immediately
              console.log(
                "Engagement batch size:",
                engagementBatchRef.current.size
              );
              if (engagementBatchRef.current.size === 5) {
                flushEngagementData();
              } else if (!batchTimerRef.current) {
                batchTimerRef.current = setTimeout(flushEngagementData, 30000); // 30s batch window
              }
            }, 10000); // 10 seconds engagement per segment
          }
        } else {
          if (timersRef.current[markerIndex]) {
            clearTimeout(timersRef.current[markerIndex]!);
            timersRef.current[markerIndex] = null;
          }
        }
      });
    };
    const handleBeforeUnload = () => {
      // Flush any accumulated engagement data before the page unloads
      console.log("Flushing engagement data on unload");

      if (engagementBatchRef.current.size > 0) {
        flushEngagementData();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const flushEngagementData = () => {
      if (engagementBatchRef.current.size > 0) {
        console.log(id);
        const payload = {
          postid: id,
          userid: session?.user?.id || null,
          segments: Array.from(engagementBatchRef.current),
        };
        console.log("There you go: ", payload);
        axios
          .post(`${backendUrl}/profiles/engagement/`, payload)
          .then(() => {
            console.log("Engagement data sent:", payload);
            engagementBatchRef.current.forEach((index) => {
              engagedSegmentsRef.current[index] = true;
            });
          })
          .catch((err) => {
            console.error("Failed to send engagement data:", err);
          });
        engagementBatchRef.current.clear();
      }
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
        batchTimerRef.current = null;
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushEngagementData();
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1, // More sensitive trigger
      rootMargin: "0px 0px 10% 0px", // Track when element enters middle 50% of viewport
    });

    markerRefs.current.forEach((marker) => {
      if (marker) observer.observe(marker);
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", flushEngagementData);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", flushEngagementData);
      flushEngagementData(); // Final flush on unmount
    };
  }, [loading, article, session?.user.id, id]);

  const RemoveArticle = async () => {
    try {
      if (!session?.access_token) {
        setError("Failed to delete article");
        toast({
          variant: "destructive",
          description: "Session expired",
        });
        return;
      }
      const { data } = await axios.delete(`${backendUrl}/articles/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (data) router("/main");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to delete article");
      toast({
        variant: "destructive",
        description: "Failed to delete article",
      });
    }
  };

  const RepublishArticle = async () => {
    try {
      if (!session?.access_token) {
        toast({
          variant: "destructive",
          description: "Session expired",
        });
        return;
      }
      const { data } = await axios.put(
        `${backendUrl}/articles/recover/${id}`,
        null,
        {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        }
      );
      if (data) window.location.reload();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to recover article",
      });
    }
  };

  // Determine if current user is authorized to modify (author or moderator)
  const isAuthorized =
    session?.user?.id === article?.userid || ROLE === "MODERATOR";

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Nav />
      <main className="px-6 lg:py-16 lg:px-10 md:container py-5">
        {article && (
          <>
            <div className="bg-white dark:bg-zinc-800 lg:p-8 p-6 rounded-lg shadow-lg border dark:border-zinc-700 transition-colors duration-150 space-y-6">
              <Link
                className="flex items-center space-x-4 bg-gray-50 dark:bg-zinc-700 p-4 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors"
                to={`/profile/${article.userid}`}
              >
                <Avatar
                  size={28}
                  url={article.user_profiles?.avatar_url}
                  onPublicRoute
                />
                <p className="text-normal text-gray-500 dark:text-zinc-400">
                  Posted by
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-zinc-100">
                  {article.user_profiles?.username || "Unknown"}
                </p>
              </Link>
              <span className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-primary dark:text-zinc-200">
                  {article.title}
                </h1>
                {isAuthorized && (
                  <span className="flex flex-col items-center space-y-4 bg-gray-100 dark:bg-zinc-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 transition-all">
                    <Button
                      onClick={() => router(`/articles/edit/${id}`)}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 dark:bg-blue-600 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-offset-2 transition-all"
                    >
                      Modify
                    </Button>
                    <DeleteWarning
                      onConfirm={
                        !article.deleted ? RemoveArticle : RepublishArticle
                      }
                      title={
                        !article.deleted
                          ? "Delete Article"
                          : "Re-Publish Article"
                      }
                      description={
                        !article.deleted
                          ? "Are you sure you want to delete this article?"
                          : "Are you sure you want to republish it?"
                      }
                      buttonLabel={
                        !article.deleted ? "Delete" : "Re-Publish Article"
                      }
                      buttonClassName={cn(
                        "px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all",
                        !article.deleted
                          ? "bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-400 dark:focus:ring-red-500"
                          : "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-400 dark:focus:ring-blue-500"
                      )}
                    />
                  </span>
                )}
              </span>
              <div className="relative">
                <div
                  ref={contentContainerRef}
                  className="text-lg leading-relaxed tiptap text-zinc-800 dark:text-zinc-300"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                {/*engagement */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    ref={(el) => (markerRefs.current[index] = el)}
                    style={{
                      position: "absolute",
                      top: `${(index * 100) / 3}%`,
                      height: "10px", 
                      width: "100%",
                      backgroundColor: "", //debug colors!
                      pointerEvents: "none",
                    }}
                    data-marker-index={index}
                    className="marker"
                  />
                ))}
              </div>
              {article.deleted && article.removalBy && article.reason && (
                <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-lg shadow-md border border-yellow-200 dark:border-yellow-700">
                  <p className="text-sm font-medium">
                    This article was removed by moderator{" "}
                    <strong>{article.removalBy}</strong> for the reason:{" "}
                    <em>{article.reason}</em>. It cannot be republished.
                  </p>
                </div>
              )}
              <div className="flex items-start justify-start mt-10 ml-auto lg:space-x-5 space-y-5 flex-col lg:flex-row">
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-800  w-full flex-1 transition-transform duration-200">
                  <Button
                    disabled={fetchedSummary}
                    onClick={fetchSummary}
                    className="max-w-fit py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
                  >
                    {fetchedSummary ? "Summary Loaded" : "Read A summary!"}
                  </Button>
                  <div className="mt-4">
                    {Summary || (
                      <div className="animate-pulse bg-gray-300 dark:bg-zinc-700 rounded-lg w-48 h-6 shadow-lg"></div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-zinc-800 p-4 lg:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 transition-all w-fit ml-auto">
                  <RatingComponent articleId={id as string} />
                </div>
              </div>
            </div>
          </>
        )}
        {!article && error && (
          <div className="mt-6 p-4 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-lg shadow-md border border-red-200 dark:border-red-700">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </main>
    </>
  );
};

export default Article;
