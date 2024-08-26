import { createBrowserRouter } from "react-router-dom";
import HomePage from "../HomePage";
import SignInPage from "../Auth";
import SignUpPage from "../SignUp";
import NotFoundPage from "../pages/Error404Page";
import AuthProtectedRoute from "./AuthProtectedRoute";
import Providers from "../providers/Provider";
import Account from '../Account'

const router = createBrowserRouter([
  // I recommend you reflect the routes here in the pages folder
  {
    path: "/",
    element: <Providers />,
    children: [
      // Public routes
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <SignInPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },{
        path: "/signup",
        element: <SignUpPage />,
      },

      // Auth Protected routes
      {
        path: "/",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: "/protected",
            element: <Account/>,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
