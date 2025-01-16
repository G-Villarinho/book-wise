import { Author } from "@/@types/author";
import { X } from "lucide-react";

interface AuthorChipProps {
  author: Author;
  onRemove: (authorId: string) => void;
}

export function AuthorChip({ author, onRemove }: AuthorChipProps) {
  return (
    <div className="flex items-center gap-2 shadow-md bg-gray-100 dark:bg-zinc-900 text-sm py-2 px-3 rounded-full">
      <img
        src={author.avatarUrl}
        alt={author.fullName}
        className="w-7 h-7 rounded-full"
      />
      <span>{author.fullName}</span>
      <button
        type="button"
        onClick={() => onRemove(author.id)}
        className="text-zinc-600 hover:text-zinc-500 duration-200 font-semibold"
      >
        <X size={20} />
      </button>
    </div>
  );
}
