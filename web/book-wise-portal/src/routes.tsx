import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "@/pages/auth/sign-in";
import { SignUp } from "@/pages/auth/sign-up";
import { AuthLayout } from "@/pages/_layouts/auth";
import { NotFound } from "@/pages/404";
import { Home } from "@/pages/app/home/home";
import { AppLayout } from "@/pages/_layouts/app";
import { Explore } from "@/pages/app/explore/explore";
import { Profile } from "@/pages/app/profile/profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },

  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
]);
