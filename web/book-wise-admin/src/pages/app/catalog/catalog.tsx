import { Header } from "@/components/header";
import { Helmet } from "react-helmet-async";
import { SearchInput } from "./search-input";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { searchExternalBooks } from "@/api/search-external-book";
import { BookCard } from "./book-card";
import { BookCardSkeleton } from "./book-card-skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const authorOrTitle = searchParams.get("authorOrTitle");

  const page =
    z
      .string()
      .transform(Number)
      .parse(searchParams.get("page") ?? "1") - 1;

  const {
    data: books,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["catalog", authorOrTitle || "", page],
    queryFn: () =>
      searchExternalBooks({
        authorOrTitle: authorOrTitle || "",
        page,
      }),
  });

  function handlePaginate(newPage: number) {
    setSearchParams((prev) => {
      prev.set("page", (newPage + 1).toString());
      return prev;
    });
  }

  return (
    <>
      <Helmet title="Catálogo" />
      <Header
        title="Catálogo de Livros"
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
              <BookCard
                key={book.externalBookId}
                externalBookId={book.externalBookId}
                coverImageUrl={book.coverImageURL}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-8 justify-between p-4">
        <Button
          variant="outline"
          onClick={() => handlePaginate(page - 1)}
          disabled={page === 0}
        >
          <ChevronLeft size={22} />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => handlePaginate(page + 1)}
          disabled={books?.length === 0}
        >
          Next
          <ChevronRight size={22} />
        </Button>
      </div>
    </>
  );
}
