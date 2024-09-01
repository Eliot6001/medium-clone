import { Outlet, Navigate} from "react-router-dom";
import { useSession } from "../context/SupabaseContext";

const AuthProtectedRoute = () => {
  const { session } = useSession();
  if (!session) {
    // or you can redirect to a different page and show a message
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default AuthProtectedRoute;
