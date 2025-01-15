import { User } from "lucide-react";

interface AuthorPreviewProps {
  fullName: string | null;
  nationality: string | null;
  biography: string | null;
  previewUrl: string | null;
}

export function CreateAuthorPreview({
  fullName,
  nationality,
  biography,
  previewUrl,
}: AuthorPreviewProps) {
  return (
    <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-zinc-800 p-6 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Foto do autor"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="text-gray-500 dark:text-gray-400" size={40} />
          )}
        </div>
        <div>
          <h2 className="font-semibold dark:text-gray-100">
            {fullName || "Nome do Autor"}
          </h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-400">
            {nationality || "Nacionalidade"}
          </p>
        </div>
      </div>
      <hr className="my-4 border-gray-300 dark:border-gray-700" />
      <p className="mt-5 text-zinc-700 dark:text-zinc-400">
        {biography || "..."}
      </p>
    </div>
  );
}
