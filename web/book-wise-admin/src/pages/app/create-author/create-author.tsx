import { Helmet } from "react-helmet-async";
import { Header } from "@/components/header";
import { CreateAuthorForm } from "./create-author-form";

export function CreateAuthor() {
  return (
    <>
      <Helmet title="Criar autor" />
      <Header
        title="Criar autor"
        subtitle="Adicione informações sobre o autor"
      />
      <div className="flex flex-col items-center px-4 mt-8">
        <div className="flex flex-col w-full max-w-5xl p-8 bg-white dark:bg-zinc-900 shadow-md rounded-lg">
          <CreateAuthorForm />
        </div>
      </div>
    </>
  );
}
