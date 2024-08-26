import { Outlet } from "react-router-dom";
import NotFoundPage from "../pages/Error404Page";
import { useSession } from "../context/SupabaseContext";

const AuthProtectedRoute = () => {
  const { session } = useSession();
  if (!session) {
    // or you can redirect to a different page and show a message
    return <NotFoundPage />;
  }
  return <Outlet />;
};

export default AuthProtectedRoute;
