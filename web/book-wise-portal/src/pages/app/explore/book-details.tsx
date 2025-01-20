import { BookDetailsCard } from "./book-details-card";
import { Stars } from "./stars";

interface BookDetailsProps {
  id: string;
  title: string;
  authors: string[];
  totalEvaluations: number;
  categories: string[];
  coverImageURL: string;
  rateAverage: number;
  totalPages: string;
}

export function BookDetails({
  id,
  title,
  authors,
  totalEvaluations,
  categories,
  coverImageURL,
  rateAverage,
  totalPages,
}: BookDetailsProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-[#181C2A] shadow rounded-lg hover:shadow-lg mt-3">
      <img
        src={coverImageURL}
        alt={title}
        className="w-24 h-32 md:w-28 md:h-36 rounded-md"
      />
      <div className="flex flex-col justify-between flex-1 min-w-0 h-full">
        <div>
          <h3 className="text-lg font-bold text-gray-100 truncate">{title}</h3>
          <p className="text-sm text-gray-400 truncate">{authors.join(", ")}</p>
        </div>
        <div className="mt-auto">
          <Stars rateAverage={rateAverage} />
        </div>
      </div>
    </div>
  );
}
