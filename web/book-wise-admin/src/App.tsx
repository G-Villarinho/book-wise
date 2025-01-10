import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "sonner";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BookProvider } from "./context/BookContext";

function App() {
  return (
    <HelmetProvider>
      <BookProvider>
        <Helmet titleTemplate="%s | book.wise" />
        <RouterProvider router={router} />
        <Toaster richColors />
      </BookProvider>
    </HelmetProvider>
  );
}

export default App;
