import authImage from "@/assets/auth-image-page.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignIn() {
  return (
    <div className="font-[sans-serif] max-w-7xl mx-auto h-screen bg-gray-900 text-white">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <form className="max-w-lg max-md:mx-auto w-full p-6">
          <div className="mb-8">
            <h3 className="text-white text-4xl font-bold">Boas vindas!</h3>
            <p className="text-gray-400 text-sm mt-6 font-normal">
              Conecte-se para explorar, organizar e compartilhar seus livros
              favoritos. Descubra novas leituras e inspire outros leitores na
              sua jornada literária!
            </p>
          </div>

          <div>
            <label className="text-white text-md font-semibold mb-2 block">
              Email
            </label>
            <Input
              className="h-12"
              placeholder="@gmail.com @hotmail.com @outlook.com"
            />
          </div>

          <div className="mt-8">
            <Button className="w-full" size="lg">
              Entrar
            </Button>
          </div>
          <p className="text-sm mt-8 text-center text-gray-400 font-semibold">
            Ainda não possui uma conta?{" "}
            <a
              href="javascript:void(0);"
              className="text-purple-500 font-semibold tracking-wide hover:underline ml-1"
            >
              Criar agora
            </a>
          </p>
        </form>

        <div className="h-full md:py-6 flex items-center relative max-md:before:hidden before:absolute before:bg-gradient-to-r before:from-gray-800 before:via-[#343d83] before:to-[#65629c] before:h-full before:w-3/4 before:right-0 before:z-0 ">
          <img
            src={authImage}
            className="rounded-md lg:w-4/5 md:w-11/12 z-50 relative"
            alt="Dining Experience"
          />
        </div>
      </div>
    </div>
  );
}
