import { Header } from "@/components/header";
import { Helmet } from "react-helmet-async";
import { SearchInput } from "./search-input";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { searchBooks } from "@/api/search-book";
import { BookCard } from "./book-card";
import { BookCardSkeleton } from "./book-card-skeleton";

export function Catalog() {
  const [searchParams] = useSearchParams();
  const authorOrTitle = searchParams.get("authorOrTitle");

  const page =
    z
      .string()
      .regex(/^\d+$/, "Invalid page")
      .transform(Number)
      .catch(() => 1)
      .parse(searchParams.get("page") ?? "1") - 1;

  const {
    data: books,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["books", authorOrTitle || "", page],
    queryFn: () =>
      searchBooks({
        authorOrTitle: authorOrTitle || "",
        page,
      }),
  });

  return (
    <div>
      <Helmet title="Catálago" />
      <Header
        title="Catálago de Livros"
        subtitle="Explore e adicione os livros de seu interesse ao portal."
      >
        <SearchInput />
      </Header>

      <div className="mt-8">
        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {Array.from({ length: 14 }).map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {books?.map((book) => (
              <BookCard key={book.key} coverImageUrl={book.coverImageURL} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
