import { getExternalBookById } from "@/api/get-external-book-by-id";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/header";
import { CreateBookForm } from "./create-book-form";

export function CreateBook() {
  const { externalBookId } = useParams();

  const { data: book } = useQuery({
    queryKey: ["book", externalBookId || ""],
    queryFn: () => getExternalBookById(externalBookId!),
    enabled: !!externalBookId,
  });

  return (
    <>
      <Helmet title="Criar livro" />
      <Header
        title="Criar Livro"
        subtitle="Adicione um novo livro ao portal principal."
      />

      <CreateBookForm book={book!} />
    </>
  );
}
