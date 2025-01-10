import { Header } from "@/components/header";
import { Helmet } from "react-helmet-async";
import { SearchInput } from "./search-input";
import { BookContext } from "@/context/BookContext";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export function Catalog() {
  const { searchBooks } = useContext(BookContext);
  const location = useLocation();
  const previousParamsRef = useRef<{ query: string; page: number }>({
    query: "",
    page: 1,
  });
  const [isFirstSearch, setIsFirstSearch] = useState(true);

  useEffect(() => {
    const handleSearchBooks = async () => {
      const urlParams = new URLSearchParams(location.search);
      const query = urlParams.get("q") || "";
      const page = Number(urlParams.get("page")) || 1;

      if (isFirstSearch) {
        await searchBooks(page, query);
        setIsFirstSearch(false);
        return;
      }

      if (
        previousParamsRef.current.query !== query ||
        previousParamsRef.current.page !== page
      ) {
        previousParamsRef.current = { query, page };
        await searchBooks(page, query);
      }
    };

    handleSearchBooks();
  }, [location.search, searchBooks, isFirstSearch]);

  return (
    <div>
      <Helmet title="Catálago" />
      <Header
        title="Catálago de Livros"
        subtitle="Explore e adicione os livros de seu interesse ao portal."
      >
        <SearchInput />
      </Header>
      <div className="mt-4"></div>
    </div>
  );
}
