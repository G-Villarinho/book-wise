import { queryClient } from "@/lib/react-query";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | book.wise" />
      <ThemeProvider defaultTheme="dark" storageKey="book-wise-theme">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster richColors />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
