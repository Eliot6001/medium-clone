import { createBrowserRouter } from "react-router-dom";
import HomePage from "../HomePage";
import Root from '../root/app'
import SignInPage from "../Login";
import SignUpPage from "../SignUp";
import NotFoundPage from "../pages/Error404Page";
import LoggingOutWindow from "../pages/Logout";
import AuthProtectedRoute from "./AuthProtectedRoute";
import Providers from "../providers/Provider";
import Account from '../Account'
import Profile from '../Profile'
import Reset from '../reset'
import Main from "@/root/main";
import Write from '@/root/write'
import EditArticle from "@/root/articles/edit/[id]";
import Article from "@/root/articles/[id]";
import Userprofile from "@/root/profile/[id]";

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
        path: '/main',
        element: <Main />
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
        path: "/account/update-password",
        element: <Reset />,

      },
      {
        path: "/articles/:id", // Dynamic route for articles with an ID
        element: <Article />,
      },
      {
        path: "/profile/:id", // Dynamic route for articles with an ID
        element: <Userprofile />,
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
            path: "/articles/edit/:id", // Dynamic route for articles with an ID
            element: <EditArticle />,
          },
          {
            path: "profile",
            element: <Profile />
          },
          {
            path: "write",
            element: <Write />
          },
          {
            path: "logout",
            element: <LoggingOutWindow />
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
