import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, FilePen, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAuthor } from "@/api/delete-author";
import { toast } from "sonner";

interface AuthorsTabelCellActionsProps {
  authorId: string;
}

export function AuthorsTabelCellActions({
  authorId,
}: AuthorsTabelCellActionsProps) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page =
    z
      .string()
      .transform(Number)
      .parse(searchParams.get("page") ?? "1") - 1;

  const { mutateAsync: deleteAuthorFn } = useMutation({
    mutationFn: deleteAuthor,
  });

  async function handleDeleteAuthor() {
    await deleteAuthorFn({ authorId });

    queryClient.invalidateQueries({
      queryKey: ["authors"],
      exact: false,
      filters: { page },
    });

    toast.success("Livro deletado com sucesso da biblioteca");
  }

  function handleUpdateAuthor() {
    navigate(`/authors/update/${authorId}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="xxs">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleUpdateAuthor}>
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
                este autor e todos os livros associados a ele.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-bold">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 font-bold"
                onClick={handleDeleteAuthor}
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
