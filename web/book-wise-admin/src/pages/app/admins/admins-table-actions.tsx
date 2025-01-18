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
import { Ellipsis, FilePen, ShieldCheck, ShieldOff, Trash } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { PaginationResponse } from "@/@types/pagination-response";
import { AdminDetailsResponse } from "@/api/get-admins";
import { blockAdmin } from "@/api/block-admin";
import { unblockAdmin } from "@/api/unblock-admin";

interface AdminsTableActionsProps {
  adminId: string;
  status: "active" | "blocked";
}

export function AdminsTableActions({
  adminId,
  status,
}: AdminsTableActionsProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const pageIndex = z.coerce
    .number()
    .transform((page) => page)
    .parse(searchParams.get("page") ?? "1");

  function updateAdminStatusOnCache(
    adminId: string,
    status: "active" | "blocked"
  ) {
    const adminsListingCache = queryClient.getQueriesData<
      PaginationResponse<AdminDetailsResponse>
    >({
      queryKey: ["admins"],
    });

    adminsListingCache.forEach(([cacheKey, cached]) => {
      if (!cached) {
        return;
      }

      queryClient.setQueryData<PaginationResponse<AdminDetailsResponse>>(
        cacheKey,
        {
          ...cached,
          data: cached.data.map((admin) => {
            if (admin.id !== adminId) {
              return admin;
            }

            return {
              ...admin,
              status,
            };
          }),
        }
      );
    });

    if (status === "active") {
      toast.success("Administrador desbloqueado com sucesso.");
    } else {
      toast.success("Administrador bloqueado com sucesso.");
    }
  }

  const { mutateAsync: blockAdminFn, isPending: isPendingBlockAdmin } =
    useMutation({
      mutationFn: blockAdmin,
      onSuccess: async (_, { adminId }) => {
        updateAdminStatusOnCache(adminId, "blocked");
      },
    });

  const { mutateAsync: unblockAdminFn, isPending: isPendingUnblockAdmin } =
    useMutation({
      mutationFn: unblockAdmin,
      onSuccess: async (_, { adminId }) => {
        updateAdminStatusOnCache(adminId, "active");
      },
    });

  async function handleBlockAdminToggle() {
    if (status === "active") {
      await blockAdminFn({ adminId });
    } else {
      await unblockAdminFn({ adminId });
    }
  }

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

  function handleNavigateUpdateAdminPage() {
    navigate(`/admins/update/${adminId}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="xxs">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleBlockAdminToggle}>
          {isPendingBlockAdmin || isPendingUnblockAdmin ? (
            <span className="animate-spin">⏳</span>
          ) : status === "active" ? (
            <>
              <ShieldOff /> Bloquear
            </>
          ) : (
            <>
              <ShieldCheck /> Desbloquear
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNavigateUpdateAdminPage}>
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
