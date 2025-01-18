import { Header } from "@/components/header";
import { Helmet } from "react-helmet-async";
import { getAdmin } from "@/api/get-admin";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UpdateAdminForm } from "./update-admin-form";
import { UpdateAdminFormSkeleton } from "./update-admin-form-skeleton";

export function UpdateAdmin() {
  const { adminId } = useParams();

  const { data: admin } = useQuery({
    queryKey: ["update-admin", adminId || ""],
    queryFn: () => getAdmin({ adminId }),
    enabled: !!adminId,
  });

  return (
    <>
      <Helmet title="Criar administrador" />
      <Header
        title="Atualizar administrador"
        subtitle="atualize dados do administrador"
      />

      {!admin && adminId ? (
        <UpdateAdminFormSkeleton />
      ) : (
        <UpdateAdminForm
          admin={{
            adminId: adminId!,
            fullName: admin?.fullName || "",
            email: admin?.email || "",
          }}
        />
      )}
    </>
  );
}
