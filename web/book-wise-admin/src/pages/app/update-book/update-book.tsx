import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/header";
import { UpdateBookFormSkeleton } from "./update-book-form-skeleton";
import { UpdateBookForm } from "./update-book-form";
import { getBook } from "@/api/get-book";

export function UpdateBook() {
  const { bookId } = useParams();

  const { data: book, isLoading } = useQuery({
    queryKey: ["update-book", bookId || ""],
    queryFn: () => getBook({ bookId }),
    enabled: !!bookId,
  });

  return (
    <>
      <Helmet title="Editar livro" />
      <Header
        title="Editar Livro"
        subtitle="Atualize as informações do livro no portal principal."
      />

      {isLoading ? <UpdateBookFormSkeleton /> : <UpdateBookForm book={book!} />}
    </>
  );
}
