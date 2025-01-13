import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "@/pages/auth/sign-in";
import { AppLayout } from "@/pages/_layouts/app";
import { Dashboard } from "@/pages/app/dashboard";
import { Catalog } from "@/pages/app/catalog/catalog";
import { CreateBook } from "@/pages/app/create-book/create-book";
import { Library } from "@/pages/app/library/library";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/catalog",
        element: <Catalog />,
      },
      {
        path: "/book/new/:externalBookId",
        element: <CreateBook />,
      },
      {
        path: "/library",
        element: <Library />,
      },
    ],
  },

  {
    path: "/sign-in",
    element: <SignIn />,
  },
]);
