import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAdmins } from "@/api/get-admins";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminsTableRow } from "./admins-table-row";
import { Pagination } from "@/components/pagination";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminsTableFilter } from "./admins-table-filter";

export function Administrators() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const fullName = searchParams.get("fullName");
  const status =
    (searchParams.get("status") as "all" | "active" | "blocked" | null) ??
    undefined;

  const pageIndex = z.coerce
    .number()
    .transform((page) => page)
    .parse(searchParams.get("page") ?? "1");

  const { data: result } = useQuery({
    queryKey: ["admins", fullName, status, pageIndex],
    queryFn: () =>
      getAdmins({
        page: pageIndex,
        fullName,
        status: status === "all" ? undefined : status,
      }),
  });

  function handleNavigateCreateAdmin() {
    navigate("/admins/new");
  }

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set("page", (pageIndex + 1).toString());

      return prev;
    });
  }

  return (
    <>
      <Helmet title="adminstradores" />
      <Header
        title="Administradores"
        subtitle="Explore e gerencie todos os administradores."
      >
        <Button onClick={handleNavigateCreateAdmin}>
          <Plus />
          Add new
        </Button>
      </Header>
      <div className="flex flex-col gap-4 mt-6 mr-4">
        <div className="space-y-2.5">
          <AdminsTableFilter />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center"></TableHead>
                  <TableHead className="w-[100px]">Nome completo</TableHead>
                  <TableHead className="w-[40px]">E-mail</TableHead>
                  <TableHead className="w-[120px]">Criado há</TableHead>
                  <TableHead className="w-[75px]">Status</TableHead>
                  <TableHead className="w-[50px] text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result &&
                  result.data.map((admin) => {
                    return <AdminsTableRow key={admin.id} admin={admin} />;
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
              page={pageIndex}
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
