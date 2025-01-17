import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "@/pages/auth/sign-in";
import { AppLayout } from "@/pages/_layouts/app";
import { Dashboard } from "@/pages/app/dashboard";
import { Catalog } from "@/pages/app/catalog/catalog";
import { CreateBook } from "@/pages/app/create-book/create-book";
import { Library } from "@/pages/app/library/library";
import { UpdateBook } from "@/pages/app/update-book/update-book";
import { NotFound } from "@/pages/404";
import { Authors } from "@/pages/app/authors/authors";
import { CreateAuthor } from "@/pages/app/create-author/create-author";
import { Forbidden } from "@/pages/403";
import { ProtectedRoute } from "./components/protected-router";
import { Administrators } from "./pages/app/admins/admins";
import { CreateAdministrator } from "./pages/app/create-administrator/create-administrator";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
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
        path: "/book/update/:bookId",
        element: <UpdateBook />,
      },
      {
        path: "/library",
        element: <Library />,
      },
      {
        path: "/authors",
        element: <Authors />,
      },
      {
        path: "/authors/new",
        element: <CreateAuthor />,
      },
      {
        path: "/",
        element: <ProtectedRoute requiredRole="owner" />,
        children: [{ path: "/admins", element: <Administrators /> }],
      },
      {
        path: "/",
        element: <ProtectedRoute requiredRole="owner" />,
        children: [{ path: "/admins/new", element: <CreateAdministrator /> }],
      },
    ],
  },

  {
    path: "/sign-in",
    element: <SignIn />,
  },

  {
    path: "/forbidden",
    element: <Forbidden />,
  },
]);
