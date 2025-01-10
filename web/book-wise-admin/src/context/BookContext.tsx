import { api } from "@/lib/axios";
import { createContext, ReactNode, useState } from "react";

interface Book {
  totalPages: number;
  totalEvaluations?: number;
  title: string;
  description: string;
  coverImageURL: string;
  authors: string[];
  categories: string[];
}

interface BookContextType {
  searchedBooks: Book[];
  searchBooks: (page: number, query?: string) => Promise<void>;
}

export const BookContext = createContext({} as BookContextType);

interface BookProviderProps {
  children: ReactNode;
}

export function BookProvider({ children }: BookProviderProps) {
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);

  async function searchBooks(page: number, query?: string) {
    const response = await api.get("/books/search", {
      params: {
        q: query || "",
        page: page,
      },
    });

    setSearchedBooks(response.data.books);
  }

  return (
    <BookContext.Provider value={{ searchedBooks, searchBooks }}>
      {children}
    </BookContext.Provider>
  );
}
