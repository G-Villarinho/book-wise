import { z } from "zod";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createAdmin } from "@/api/create-admin";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const createAdminSchema = z.object({
  fullName: z
    .string()
    .nonempty("O nome completo é obrigatório.")
    .max(255, "O nome não pode ultrapassar 255 caracteres."),
  email: z
    .string()
    .nonempty("O e-mail é obrigatório.")
    .email("O e-mail precisa ter um formato válido.")
    .max(255, "O e-mail não ultrapassar 255 caracteres"),
});

type CreateAdminSchemaData = z.infer<typeof createAdminSchema>;

export function CreateAdministrator() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateAdminSchemaData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const { mutateAsync: createAdminFn, isPending } = useMutation({
    mutationFn: createAdmin,
  });

  async function handleCreateAdmin(data: CreateAdminSchemaData) {
    await createAdminFn({ fullName: data.fullName, email: data.email });
    toast.success("Administrador criado com sucesso.");
    navigate("/admins");
  }

  return (
    <>
      <Helmet title="Criar administrador" />
      <Header
        title="Criar administrador"
        subtitle="Adicione um novo administrador"
      />

      <form
        onSubmit={handleSubmit(handleCreateAdmin)}
        className="w-full max-w-2xl mt-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-bold mb-2">Nome completo</label>
            <Input
              placeholder="Digite o nome completo"
              {...register("fullName")}
            />
            {errors.fullName && (
              <small className="text-sm text-red-500 ">
                {errors.fullName.message}
              </small>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-bold mb-2">E-mail</label>
            <Input placeholder="Digite o e-mail" {...register("email")} />
            {errors.email && (
              <small className="text-sm text-red-500 ">
                {errors.email.message}
              </small>
            )}
          </div>
          <Button className="w-40" disabled={isPending}>
            Criar admin
          </Button>
        </div>
      </form>
    </>
  );
}
