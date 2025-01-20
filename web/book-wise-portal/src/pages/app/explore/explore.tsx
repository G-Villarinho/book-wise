import { Header } from "@/components/header";
import { Search } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { BookCard } from "./book-card";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { getPublishdBook } from "@/api/get-published-book";
import { Pagination } from "@/components/pagination";
import { SearchFilter } from "./search-filter";
import { CategoryFilter } from "./category-filter";

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q");
  const categoryId = searchParams.get("categoryId");

  const page = z.coerce.number().parse(searchParams.get("page") ?? "1");

  const { data: result } = useQuery({
    queryKey: ["orders", q, categoryId, page],
    queryFn: () =>
      getPublishdBook({
        page,
        limit: 15,
        q,
        categoryId,
      }),
  });

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set("page", pageIndex.toString());
      return prev;
    });
  }

  return (
    <>
      <Helmet title="Explorar" />
      <Header title="Explorar" icon={Search}>
        <SearchFilter />
      </Header>

      <div className="ml-14">
        <CategoryFilter />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-12">
        {result?.data.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </div>
      <div className="p-4">
        {result && (
          <Pagination
            page={page}
            total={result.total}
            totalPages={result.totalPages}
            onPageChange={handlePaginate}
          />
        )}
      </div>
    </>
  );
}
