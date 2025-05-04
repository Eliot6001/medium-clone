import { createBrowserRouter } from "react-router-dom";
import Root from '../root/app'
import SignInPage from "../Login";
import SignUpPage from "../SignUp";
import NotFoundPage from "../pages/Error404Page";
import LoggingOutWindow from "../pages/Logout";
import AuthProtectedRoute from "./AuthProtectedRoute";
import Providers from "../providers/Provider";
import Account from '../root/profile/AccountModification'
import Profile from '../root/profile/Profile'
import Reset from '../reset'
import Main from "@/root/main";
import Write from '@/root/write'
import EditArticle from "@/root/articles/edit/[id]";
import DeletedArticles from '@/root/articles/deleted'
import Article from "@/root/articles/[id]";
import Userprofile from "@/root/profile/[id]";
import Search from "@/root/search/[query]";
import HistoryData from "@/root/articles/history";
import Explore from "@/root/explore";

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
        path:'/explore',
        element: <Explore />
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
     {
      path: "/search",
      element: <Search />
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
            path: "/articles/deleted",
            element: <DeletedArticles />,
          },
          {
            path: "/articles/history", 
            element: <HistoryData />,
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
