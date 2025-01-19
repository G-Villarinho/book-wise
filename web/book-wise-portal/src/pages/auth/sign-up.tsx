import { createMember } from "@/api/create-member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const signUpSchema = z.object({
  fullName: z
    .string()
    .min(1, "Por favor, informe seu nome completo.")
    .max(255, "Seu nome não pode passar de 255 caracteres."),
  email: z
    .string()
    .min(1, "Por favor, informe seu e-mail.")
    .email("Por favor, insira um e-mail válido."),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const { mutateAsync: registerMember } = useMutation({
    mutationFn: createMember,
  });

  async function handleCreateMember({ fullName, email }: SignUpSchema) {
    try {
      await registerMember({ fullName, email });
      toast.success("Cadastro efetuado com sucesso!", {
        description: "",
        action: {
          label: "Login",
          onClick: () => {
            navigate(`/sign-in?email=${email}`);
          },
        },
      });
    } catch {
      toast.error(
        "Ocorreu um erro ao tentar cadastra-lo. Por favor, tente novamente mais tarde."
      );
    }
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="text-white text-4xl font-bold">Crie sua conta</h3>
        <p className="text-gray-400 text-sm mt-6 font-normal">
          Junte-se a nós para explorar, organizar e compartilhar seus livros
          favoritos. Inspire e conecte-se com outros leitores na sua jornada
          literária!
        </p>
      </div>

      <form onSubmit={handleSubmit(handleCreateMember)}>
        <div>
          <label className="text-white text-md font-semibold mb-2 block">
            Nome completo
          </label>
          <Input
            className="h-12 mb-1"
            placeholder="Digite seu nome completo"
            {...register("fullName")}
          />
          {errors.fullName && (
            <small className="text-sm text-red-600 font-semibold">
              {errors.fullName.message}
            </small>
          )}
        </div>

        <div className="mt-4">
          <label className="text-white text-md font-semibold mb-2 block">
            Email
          </label>
          <Input
            className="h-12 mb-1"
            placeholder="seuemail@exemplo.com"
            {...register("email")}
          />
          {errors.email && (
            <small className="text-sm text-red-600 font-semibold">
              {errors.email.message}
            </small>
          )}
        </div>

        <div className="mt-8">
          <Button className="w-full" size="lg" disabled={isSubmitting}>
            Criar conta
          </Button>
        </div>
      </form>
      <p className="text-sm mt-8 text-center text-gray-400 font-semibold">
        Já possui uma conta?{" "}
        <Link
          to="/sign-in"
          className="text-purple-500 font-semibold tracking-wide hover:underline ml-1"
        >
          Entrar
        </Link>
      </p>
    </>
  );
}
