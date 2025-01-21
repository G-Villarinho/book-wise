import { Stars } from "@/components/stars";
import { Bookmark, BookOpen } from "lucide-react";

interface BookDetailsCardProps {
  title: string;
  authors: string[];
  totalEvaluations: number;
  categories: string[];
  coverImageURL: string;
  rateAverage: number;
  totalPages: string;
}

export function BookDetailsCard({
  title,
  authors,
  totalEvaluations,
  categories,
  coverImageURL,
  rateAverage,
  totalPages,
}: BookDetailsCardProps) {
  return (
    <div className="bg-app-gray-700 rounded-lg">
      <div className="flex flex-col gap-10 p-6">
        <div className="flex flex-wrap gap-6">
          <img
            src={coverImageURL}
            alt={title}
            className="w-24 h-32 md:w-36 md:h-48 rounded-md"
          />
          <div className="flex flex-col flex-1 min-w-0">
            <div>
              <h3
                className="text-lg font-bold text-gray-100 truncate max-w-full"
                title={title}
              >
                {title}
              </h3>
              <p
                className="text-sm text-gray-400 truncate max-w-full"
                title={authors.join(", ")}
              >
                {authors.join(", ")}
              </p>
            </div>
            <div className="mt-auto flex flex-col gap-1">
              <Stars rateAverage={rateAverage} />
              <p className="text-sm ml-1 text-gray-400">
                {totalEvaluations} Avaliações
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700" />

        <div className="flex flex-wrap items-center gap-8">
          <div className="flex flex-row gap-4 items-center min-w-0">
            <Bookmark size={22} className="text-app-green-100" />
            <div className="flex flex-col gap-1 text-sm min-w-0">
              <h4 className="text-app-gray-300">Categoria</h4>
              <span
                className="text-sm font-semibold text-app-gray-200 truncate max-w-full"
                title={categories.join(", ")}
              >
                {categories.join(", ")}
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center min-w-0">
            <BookOpen size={22} className="text-app-green-100" />
            <div className="flex flex-col gap-1 text-sm min-w-0">
              <h4 className="text-app-gray-300">Páginas</h4>
              <span className="text-sm font-semibold text-app-gray-200 truncate max-w-full">
                {totalPages}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
