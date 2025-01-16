import { getExternalBookById } from "@/api/get-external-book-by-id";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/header";
import { CreateBookForm } from "./create-book-form";
import { CreateBookFormSkeleton } from "./create-book-form-skeleton";

export function CreateBook() {
  const { externalBookId } = useParams();

  const { data: book, isLoading } = useQuery({
    queryKey: ["create-book", externalBookId || ""],
    queryFn: () => getExternalBookById(externalBookId!),
    enabled: !!externalBookId,
    staleTime: 1000 * 60 * 15,
  });

  return (
    <>
      <Helmet title="Criar livro" />
      <Header
        title="Criar Livro"
        subtitle="Adicione um novo livro ao portal principal."
      />

      {isLoading ? <CreateBookFormSkeleton /> : <CreateBookForm book={book!} />}
    </>
  );
}
