import { createBrowserRouter } from "react-router-dom";
import HomePage from "../HomePage";
import Root from '../root/app'
import SignInPage from "../Auth";
import SignUpPage from "../SignUp";
import NotFoundPage from "../pages/Error404Page";
import AuthProtectedRoute from "./AuthProtectedRoute";
import Providers from "../providers/Provider";
import Account from '../Account'
import Profile from '../Profile'
import Reset from '../reset'

const router = createBrowserRouter([
  // I recommend you reflect the routes here in the pages folder
  {
    path: "/",
    element: <Providers />,
    children: [
      // Public routes
      {
        path: "/",
        element: < Root />,
      },
      {
        path: "/login",
        element: <SignInPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      }, {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        path: "/reset",
        element: <Reset/>,

      },

      // Auth Protected routes
      {
        path: "/",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: "account",
            element: <Account />,
          },
          {
            path: "profile",
            element: <Profile />
          }
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
