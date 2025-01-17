import { deleteAdmin } from "@/api/delete-admin";
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
import { Ellipsis, FilePen, Trash } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

interface AdminsTableActionsProps {
  adminId: string;
}

export function AdminsTableActions({ adminId }: AdminsTableActionsProps) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const pageIndex = z.coerce
    .number()
    .transform((page) => page)
    .parse(searchParams.get("page") ?? "1");

  const { mutateAsync: deleteAdminFn } = useMutation({
    mutationFn: deleteAdmin,
  });

  async function handleDeleteAdmin() {
    await deleteAdminFn({ adminId });
    queryClient.invalidateQueries({
      queryKey: ["admins"],
      exact: false,
      filters: { pageIndex },
    });
    toast.success("Administrador deletado com sucesso.");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="xxs">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <FilePen /> Editar
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Trash /> Deletar
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. Isso removerá permanentemente
                este administrador do sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-bold">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAdmin}
                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 font-bold"
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
