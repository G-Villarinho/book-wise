import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookText } from "lucide-react";

export function SignIn() {
  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
          <div>
            <BookText size={50} className="mb-2" />
            <h2 className="lg:text-5xl text-3xl font-extrabold lg:leading-[55px] text-gray-800">
              Painel administrativo do Book Wise
            </h2>
            <p className="text-sm mt-6 text-gray-800">
              Faça login para gerenciar o sistema, acompanhar estatísticas e
              acessar as ferramentas avançadas da plataforma.
            </p>
            <p className="text-sm mt-12 text-gray-800">
              Não tem uma conta de administrador?{" "}
              <a
                href="javascript:void(0);"
                className="text-sky-600 font-semibold hover:underline ml-1"
              >
                Solicite acesso aqui
              </a>
            </p>
          </div>

          <form className="max-w-md md:ml-auto w-full">
            <h3 className="text-gray-800 text-3xl font-extrabold mb-8">
              Entrar
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm text-zinc-600">
                  Informe o seu e-mail:
                </label>
                <Input
                  id="email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  className="text-lg py-5"
                  placeholder="Ex: @gmail, @outlook, @yahoo, etc."
                />
              </div>
            </div>

            <div className="!mt-8">
              <Button className="w-full font-semibold" size="lg">
                Acessar painel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
