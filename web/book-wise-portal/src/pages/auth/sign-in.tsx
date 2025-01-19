import { signIn } from "@/api/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Por favor, informe seu e-mail.")
    .email("Por favor, insira um e-mail válido."),
});

type SignInSchema = z.infer<typeof signInSchema>;

export function SignIn() {
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
    },
  });

  const { mutateAsync: authenticate, isSuccess } = useMutation({
    mutationFn: signIn,
  });

  async function handleAuthenticate({ email }: SignInSchema) {
    try {
      await authenticate({ email });
      toast.success("Enviamos um link de autenticação para seu e-mail.", {
        action: {
          label: "Reenviar",
          onClick: () => authenticate({ email }),
        },
      });
    } catch {
      toast.error(
        "Ocorreu um erro ao tentar autenticar. Por favor, tente novamente."
      );
    }
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="text-white text-4xl font-bold">Boas vindas!</h3>
        <p className="text-gray-400 text-sm mt-6 font-normal">
          Conecte-se para explorar, organizar e compartilhar seus livros
          favoritos. Descubra novas leituras e inspire outros leitores na sua
          jornada literária!
        </p>
      </div>

      <form onSubmit={handleSubmit(handleAuthenticate)}>
        <div>
          <label className="text-white text-md font-semibold mb-2 block">
            Email
          </label>
          <Input
            className="h-12 mb-1"
            placeholder="@gmail.com @hotmail.com @outlook.com"
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
            {isSuccess ? "Reenviar" : "Entrar no portal"}
          </Button>
        </div>
      </form>
      <p className="text-sm mt-8 text-center text-gray-400 font-semibold">
        Ainda não possui uma conta?{" "}
        <Link
          to="/sign-up"
          className="text-purple-500 font-semibold tracking-wide hover:underline ml-1"
        >
          Crie uma agora!
        </Link>
      </p>
    </>
  );
}
