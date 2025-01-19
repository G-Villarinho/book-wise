import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Página não encontrada</h1>
      <p className="text-accent-foreground text-white">
        Voltar para a{"   "}
        <Link className="text-violet-500 dark:text-violet-400" to="/">
          Home
        </Link>
        .
      </p>
    </div>
  );
}
