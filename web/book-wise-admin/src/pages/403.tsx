import { Link } from "react-router-dom";

export function Forbidden() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-extrabold text-red-500">403</h1>
      <h2 className="text-3xl font-bold">Acesso Proibido</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Você não tem permissão para acessar esta página.
      </p>
      <Link
        className="text-lg font-medium text-sky-500 dark:text-sky-400 hover:underline"
        to="/"
      >
        Voltar para o dashboard
      </Link>
    </div>
  );
}
