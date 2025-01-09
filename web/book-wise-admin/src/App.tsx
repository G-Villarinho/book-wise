import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "sonner";
import { Helmet, HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | book.wise" />
      <RouterProvider router={router} />
      <Toaster richColors />
    </HelmetProvider>
  );
}

export default App;
