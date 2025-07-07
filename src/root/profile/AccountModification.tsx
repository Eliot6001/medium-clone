import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Nav from "@/components/fullComponents/Nav";
import Avatar from "../../Avatar";
import { Button } from "../../components/ui/button";
import { useSession } from "../../context/SupabaseContext";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useProfile from "../../hooks/useProfileData";
import { Info } from "lucide-react";
import axios from "axios";

export default function Account() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");

  const { toast } = useToast();
  const { session } = useSession();

  const {
    loading: isFetching,
    username: fetchedUserName,
    website: fetchedWebsite,
    avatarUrl: fetchedavatarUrl,
  } = useProfile(session?.access_token);

  useEffect(() => {
    setLoading(isFetching);
    if (fetchedUserName) setUsername(fetchedUserName);
    if (fetchedWebsite) setWebsite(fetchedWebsite);
    if (fetchedavatarUrl) setAvatarUrl(fetchedavatarUrl);
  }, [isFetching, fetchedUserName, fetchedWebsite, fetchedavatarUrl]);

  async function updateProfile(avatarUrl: string) {
    setLoading(true);
    if (!session)
      return toast({
        variant: "destructive",
        title: "Update failed",
        description: `Try logging in again!`,
        duration: 1500,
      });

    const { user, access_token } = session;
    try {
      await axios.patch(
        `${backendUrl}/profiles/${user.id}`,
        {
          username,
          website,
          avatar_url: avatarUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      setAvatarUrl(avatarUrl);

      toast({
        title: "Success!",
        description: "Profile updated successfully.",
        duration: 1500,
      });
    } catch (error: unknown) {
      let errorMessage = "Unknown error";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.error || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Update failed",
        description: `Error: ${errorMessage}`,
        duration: 1500,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />
      <div className="container px-8 py-6 w-8/12 ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateProfile(avatar_url);
          }}
          className="space-y-6 apply-colors-primary p-6 rounded-lg shadow-md"
        >
          <div className="flex justify-center">
            <Avatar
              url={avatar_url}
              size={150}
              onUpload={(e, url) =>{
                e.preventDefault();
                updateProfile(url)}
              }
            />
          </div>
          <span className="flex space-x-2 px-2 py-3 border-1 border rounded-lg border-black dark:border-slate-400">
            <Info />{" "}
            <p className="small">
              You don't have to press update for this to update
            </p>
          </span>
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-primary font-medium">
              Email
            </label>
            <Input
              id="email"
              type="text"
              value={session?.user.email}
              disabled
              className="bg-gray-200 dark:bg-zinc-900"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="username" className="text-primary font-medium">
              Name
            </label>
            <Input
              id="username"
              type="text"
              required
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              className="apply-colors-primary"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="website" className="text-primary font-medium">
              Website
            </label>
            <Input
              id="website"
              type="url"
              value={website || ""}
              onChange={(e) => setWebsite(e.target.value)}
              className="apply-colors-primary"
            />
          </div>

          <div className="flex justify-end divide-x-5 gap-2">
            <div>
              <Button
                variant={"default"}
                className=" bg-sky-400 hover:bg-sky-500 text-black py-2 px-4 rounded shadow-md hover:shadow-lg transition duration-300 "
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading ..." : "Update"}
              </Button>
            </div>

            <div>
              <Button
                className="rounded transition-colors duration-300 dark:hover:bg-zinc-900 "
                variant={"outline"}
                type="button"
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
