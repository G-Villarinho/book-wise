import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { createAuthor } from "@/api/create-author";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const createAuthorSchema = z.object({
  fullName: z
    .string()
    .nonempty("O nome completo é obrigatório")
    .max(255, "O nome pode ter no máximo 255 caracteres"),
  nationality: z
    .string()
    .nonempty("A nacionalidade é obrigatória")
    .max(70, "A nacionalidade pode ter no máximo 70 caracteres"),
  biography: z
    .string()
    .nonempty("A biografia é obrigatória")
    .max(1000, "A biografia pode ter no máximo 1000 caracteres"),
  profilePicture: z
    .instanceof(File, {
      message: "A foto de perfil é obrigatória",
    })
    .refine((file) => file instanceof File, {
      message: "A foto de perfil é obrigatória",
    }),
});

type CreateAuthorFormData = z.infer<typeof createAuthorSchema>;

export function CreateAuthorForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useForm<CreateAuthorFormData>({
    resolver: zodResolver(createAuthorSchema),
    defaultValues: {
      fullName: "",
      nationality: "",
      biography: "",
      profilePicture: undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profilePicture", file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const fullName = watch("fullName");
  const nationality = watch("nationality");
  const biography = watch("biography");

  const { mutateAsync: createAuthorFn } = useMutation({
    mutationFn: createAuthor,
  });

  const handleCreateAuthor = async (data: CreateAuthorFormData) => {
    await createAuthorFn({
      fullName: data.fullName,
      nationality: data.nationality,
      biography: data.biography,
      profilePicture: data.profilePicture,
    });

    toast.success("Autor Criado com sucesso!");
    toast.info(
      "A imagem está sendo processada em segundo plano, por isso pode levar algum tempo para aparecer."
    );
    navigate("/authors");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Formulário */}
      <div className="flex flex-col w-full lg:w-1/2 space-y-6">
        <div className="flex flex-col items-center">
          <label htmlFor="imageUpload" className="cursor-pointer group">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center group-hover:opacity-80 transition-opacity">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Prévia da imagem"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-gray-500" size={40} />
              )}
            </div>
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {errors.profilePicture && (
            <p className="text-sm text-red-600 mt-1">
              {errors.profilePicture.message}
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit(handleCreateAuthor)}
          className="flex flex-col gap-6"
        >
          <Input
            {...register("fullName")}
            placeholder="Digite o nome completo"
          />
          {errors.fullName && <p>{errors.fullName.message}</p>}

          <Input {...register("nationality")} placeholder="Nacionalidade" />
          {errors.nationality && <p>{errors.nationality.message}</p>}

          <Controller
            name="biography"
            control={control}
            render={({ field }) => (
              <Textarea {...field} placeholder="Breve biografia" rows={3} />
            )}
          />
          {errors.biography && <p>{errors.biography.message}</p>}

          <Button type="submit">Criar autor</Button>
        </form>
      </div>

      {/* Preview */}
      <div className="w-full lg:w-1/2 bg-gray-100 p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Foto do autor"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-gray-500" size={40} />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{fullName || "Nome do Autor"}</h2>
            <p className="text-sm text-zinc-700">
              {nationality || "Nacionalidade"}
            </p>
          </div>
        </div>
        <p className="mt-5">{biography || "A biografia será exibida aqui."}</p>
      </div>
    </div>
  );
}
