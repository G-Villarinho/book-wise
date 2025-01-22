import { Header } from "@/components/header";
import { BookCard } from "@/components/book-card";
import { Search } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { getPublishedBook } from "@/api/get-published-book";
import { Pagination } from "@/components/pagination";
import { SearchFilter } from "./search-filter";
import { CategoryFilter } from "./category-filter";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BookDetails } from "./book-details";

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q");
  const categoryId = searchParams.get("categoryId");

  const page = z.coerce.number().parse(searchParams.get("page") ?? "1");

  const { data: result } = useQuery({
    queryKey: ["books", q, categoryId, page],
    queryFn: () =>
      getPublishedBook({
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
          <Sheet key={book.id}>
            <SheetTrigger>
              <BookCard {...book} />
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-[540px] bg-app-gray-800">
              <SheetHeader>
                <SheetTitle />
                <SheetDescription />
              </SheetHeader>
              <BookDetails book={book} />
            </SheetContent>
          </Sheet>
        ))}
      </div>
      <div>
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
