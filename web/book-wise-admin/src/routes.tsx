import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "@/pages/auth/sign-in";

export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignIn />,
  },
]);
