import { updateAdmin } from "@/api/update-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const updateAdminSchema = z.object({
  fullName: z
    .string()
    .max(255, "O nome não pode ultrapassar 255 caracteres.")
    .optional(),
  email: z
    .string()
    .email("O e-mail precisa ter um formato válido.")
    .max(255, "O e-mail não ultrapassar 255 caracteres")
    .optional(),
});

type UpdateAdminSchemaData = z.infer<typeof updateAdminSchema>;

interface UpdateAdminFormProps {
  admin: {
    adminId: string;
    fullName: string;
    email: string;
  };
}

export function UpdateAdminForm({ admin }: UpdateAdminFormProps) {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UpdateAdminSchemaData>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      fullName: admin?.fullName || "",
      email: admin?.email || "",
    },
    shouldUseNativeValidation: false,
    mode: "onBlur",
    criteriaMode: "all",
  });

  const { mutateAsync: updateAdminFn, isPending } = useMutation({
    mutationFn: updateAdmin,
  });

  const atLeastOneField = (data: UpdateAdminSchemaData) => {
    if (!data.fullName && !data.email) {
      return { fullName: "Pelo menos um campo deve ser preenchido." };
    }
    return {};
  };

  async function handleCreateAdmin(data: UpdateAdminSchemaData) {
    const validationError = atLeastOneField(data);
    if (Object.keys(validationError).length > 0) {
      toast.error(validationError.fullName);
      return;
    }
    await updateAdminFn({
      adminId: admin.adminId,
      fullName: data.fullName,
      email: data.email,
    });
    toast.success("Administrador atualizado com sucesso.");
    navigate("/admins");
  }

  return (
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
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}
