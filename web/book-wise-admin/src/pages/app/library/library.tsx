import { Header } from "@/components/header";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { getBooks } from "@/api/get-books";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/components/pagination";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { LibraryTableRow } from "./library-table-row";
import { LibraryTableFilter } from "./library-table-filter";

export function Library() {
  const [searchParams, setSearchParams] = useSearchParams();

  const title = searchParams.get("title");
  const bookId = searchParams.get("bookId");
  const authorId = searchParams.get("authorId");
  const categoryId = searchParams.get("categoryId");

  const page = z
    .string()
    .transform(Number)
    .parse(searchParams.get("page") ?? "1");

  const { data: result } = useQuery({
    queryKey: ["library", title, bookId, authorId, categoryId, page],
    queryFn: () =>
      getBooks({
        page,
        title,
        bookId,
        authorId,
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
      <Helmet title="Catálogo" />
      <Header
        title="Biblioteca"
        subtitle="Explore e  gerencie todos os livros adicionados."
      />

      <div className="flex flex-col gap-4 mt-6 mr-4">
        <div className="space-y-2.5">
          <LibraryTableFilter />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[340px]">Identificador</TableHead>
                  <TableHead className="w-[180px]">Criado há</TableHead>
                  <TableHead className="w-[240px]">Título</TableHead>
                  <TableHead>Autor(s)</TableHead>
                  <TableHead>Categoria(s)</TableHead>
                  <TableHead className="w-[64px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result &&
                  result.data.map((books) => {
                    return <LibraryTableRow key={books.id} book={books} />;
                  })}

                {result && result.data.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-muted-foreground"
                    >
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {result && (
            <Pagination
              page={page}
              total={result.total}
              totalPages={result.totalPages}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </>
  );
}
