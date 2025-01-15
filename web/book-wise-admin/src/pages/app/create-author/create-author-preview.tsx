import { User } from "lucide-react";

type AuthorPreviewProps = {
  fullName: string | null;
  nationality: string | null;
  biography: string | null;
  previewUrl: string | null;
};

export function CreateAuthorPreview({
  fullName,
  nationality,
  biography,
  previewUrl,
}: AuthorPreviewProps) {
  return (
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
      <hr className="my-4 border-gray-300" />
      <p className="mt-5 text-zinc-700">{biography || "..."}</p>
    </div>
  );
}
