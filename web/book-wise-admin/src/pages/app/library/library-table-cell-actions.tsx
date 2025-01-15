import { PaginationResponse } from "@/@types/pagination-response";
import { deleteBook } from "@/api/delete-book";
import { BookResponse } from "@/api/get-books";
import { publishBook } from "@/api/publish-book";
import { unpublishBook } from "@/api/unpublish-book";
import { z } from "zod";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Ellipsis, Trash, FilePen, Forward, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

interface LibraryTableCellActionsProps {
  bookId: string;
  isPublished: boolean;
}

export function LibraryTableCellActions({
  bookId,
  isPublished,
}: LibraryTableCellActionsProps) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page =
    z
      .string()
      .transform(Number)
      .parse(searchParams.get("page") ?? "1") - 1;

  function updateBookPublishStatsOnCache(
    bookId: string,
    publishedStatus: boolean
  ) {
    const libraryListingCache = queryClient.getQueriesData<
      PaginationResponse<BookResponse>
    >({
      queryKey: ["library"],
    });

    libraryListingCache.forEach(([cacheKey, cached]) => {
      if (!cached) {
        return;
      }

      queryClient.setQueryData<PaginationResponse<BookResponse>>(cacheKey, {
        ...cached,
        data: cached.data.map((book) => {
          if (book.id !== bookId) {
            return book;
          }

          return {
            ...book,
            published: publishedStatus,
          };
        }),
      });
    });

    if (publishedStatus) {
      toast.success("Livro publicado com sucesso!");
    } else {
      toast.success("Livro despublicado com sucesso!");
    }
  }

  const { mutateAsync: publishBookFn, isPending: isPendingPublishBook } =
    useMutation({
      mutationFn: publishBook,
      onSuccess: async (_, { bookId }) => {
        updateBookPublishStatsOnCache(bookId, true);
      },
    });

  const { mutateAsync: unpublishBookFn, isPending: isPendingUnpublishBook } =
    useMutation({
      mutationFn: unpublishBook,
      onSuccess: async (_, { bookId }) => {
        updateBookPublishStatsOnCache(bookId, false);
      },
    });

  async function handlePublishToggle() {
    if (isPublished) {
      await unpublishBookFn({ bookId });
    } else {
      await publishBookFn({ bookId });
    }
  }

  function handleUpdateBook() {
    navigate(`/book/update/${bookId}`);
  }

  const { mutateAsync: deleteBookFn } = useMutation({
    mutationFn: deleteBook,
  });

  async function handleDeleteBook() {
    try {
      await deleteBookFn({ bookId });

      queryClient.invalidateQueries({
        queryKey: ["library"],
        exact: false,
        filters: { page },
      });

      toast.success("Livro deletado com sucesso da biblioteca");
    } catch {
      toast.error("Erro ao deletar o livro. Tente novamente.");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="xxs">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handlePublishToggle}>
          {isPendingPublishBook || isPendingUnpublishBook ? (
            <span className="animate-spin">⏳</span>
          ) : isPublished ? (
            <>
              <RotateCcw /> Despublicar
            </>
          ) : (
            <>
              <Forward /> Publicar
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleUpdateBook}>
          <FilePen /> Edit
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Trash /> Remove
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. Isso removerá permanentemente
                este livro da biblioteca.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-bold">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 font-bold"
                onClick={handleDeleteBook}
              >
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
