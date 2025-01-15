import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAuthors } from "@/api/get-authors";
import { Pagination } from "@/components/pagination";
import { AuthorsTableRow } from "./authors-table-row";
import { AuthorTableFilter } from "./authors-table-filter";

export function Authors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const fullName = searchParams.get("fullName");
  const authorId = searchParams.get("authorId");

  const page = z
    .string()
    .transform(Number)
    .parse(searchParams.get("page") ?? "1");

  const { data: result } = useQuery({
    queryKey: ["authors", fullName, authorId, page],
    queryFn: () =>
      getAuthors({
        page,
        fullName,
        authorId,
      }),
  });

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set("page", pageIndex.toString());

      return prev;
    });
  }

  function handleCreateAuthor() {
    navigate("/authors/new");
  }

  return (
    <>
      <Helmet title="Autores" />
      <Header
        title="Autores"
        subtitle="Explore e gerencie todos os autores adicionados."
      >
        <Button className="font-bold" onClick={handleCreateAuthor}>
          <Plus />
          Add new
        </Button>
      </Header>

      <div className="flex flex-col gap-4 mt-6 mr-4">
        <div className="space-y-2.5">
          <AuthorTableFilter />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center"></TableHead>
                  <TableHead className="w-[110px]">Identificador</TableHead>
                  <TableHead className="w-[150px]">Nome completo</TableHead>
                  <TableHead className="w-[100px]">Criado há</TableHead>
                  <TableHead className="w-[100px]">Nacionalidade</TableHead>
                  <TableHead className="w-[75px] text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result &&
                  result.data.map((author) => {
                    return <AuthorsTableRow key={author.id} author={author} />;
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
