import { Header } from "@/components/header";
import { Helmet } from "react-helmet-async";
import { SearchInput } from "./search-input";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { searchBooks } from "@/api/search-book";
import { BookCard } from "./book-card";

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const authorOrTitle = searchParams.get("authorOrTitle");

  const page = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("page") ?? "1");

  // Realiza a consulta dos livros com a pesquisa e a página atual
  const {
    data: books,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["books", authorOrTitle, page],
    queryFn: () =>
      searchBooks({
        authorOrTitle,
        page,
      }),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set("page", (pageIndex + 1).toString());
      return prev;
    });
  }

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
          <p>Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {books?.map((book) => (
              <BookCard
                key={book.title}
                title={book.title}
                authors={book.authors}
                description={book.description}
                coverImageUrl={book.coverImageURL}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
