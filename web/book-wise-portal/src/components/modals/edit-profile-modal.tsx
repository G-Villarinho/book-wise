import { useContext, useState } from "react";
import { z } from "zod";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserContext } from "@/components/user-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User } from "lucide-react";

const editProfileSchema = z.object({
  fullName: z
    .string()
    .max(255, "O nome pode ter no máximo 255 caracteres")
    .optional(),
  profilePicture: z
    .instanceof(File, {
      message: "A foto de perfil necessita ser dos tipos JPG, JPEG ou PNG",
    })
    .refine(
      (file) =>
        file instanceof File &&
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "A foto de perfil necessita ser dos tipos JPG, JPEG ou PNG",
      }
    )
    .optional(),
});

type EditProfileSchema = z.infer<typeof editProfileSchema>;

interface EditProfleModalProps {
  onClose: () => void;
}

export function EditProfileModal({ onClose }: EditProfleModalProps) {
  const { user } = useContext(UserContext);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.avatar ?? null
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: user?.fullName,
    },
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profilePicture", file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  function handleModalClose() {
    reset();
    setPreviewUrl(user?.avatar ?? null);
    onClose();
  }

  function handleEditProfile(data: EditProfileSchema) {
    console.log(data);
    // Aqui você pode enviar os dados para o backend ou realizar a atualização do perfil
  }

  return (
    user && (
      <DialogContent
        className="sm:max-w-[520px] bg-app-gray-800"
        onPointerDownOutside={handleModalClose}
        onEscapeKeyDown={handleModalClose}
        onCloseAutoFocus={handleModalClose}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Atualizar Informações do Perfil
          </DialogTitle>
          <DialogDescription>
            Altere suas informações pessoais, como nome, foto de perfil ou
            outros detalhes.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleEditProfile)}
          className="flex flex-col space-y-4"
        >
          <div className="flex flex-col items-center">
            <label htmlFor="imageUpload" className="cursor-pointer group">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-700 flex items-center justify-center group-hover:opacity-80 transition-opacity">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Prévia da imagem"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    className="text-gray-500 dark:text-gray-400"
                    size={40}
                  />
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
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.profilePicture.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="block text-sm font-semibold">
              Nome Completo
            </label>
            <Input id="fullName" type="text" {...register("fullName")} />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="block text-sm font-medium">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={user.email}
              readOnly
              disabled
            />
          </div>

          <Button size="lg" type="submit">
            Salvar alterações
          </Button>
        </form>
      </DialogContent>
    )
  );
}
