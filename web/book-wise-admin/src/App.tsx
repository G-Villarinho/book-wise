import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { queryClient } from "@/lib/react-query";

function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | book.wise" />
      <ThemeProvider defaultTheme="light" storageKey="book-wise-theme">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster richColors />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
