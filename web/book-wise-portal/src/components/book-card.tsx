import { Stars } from "@/components/stars";

interface BookCardProps {
  title: string;
  authors: string[];
  coverImageURL: string;
  rateAverage: number;
  hasRead: boolean;
}

export function BookCard({
  title,
  authors,
  coverImageURL,
  rateAverage,
  hasRead,
}: BookCardProps) {
  return (
    <div className="relative bg-app-gray-700 hover:bg-app-gray-600 duration-200 shadow rounded-lg mt-3">
      {hasRead && (
        <span className="absolute top-0 right-0 bg-app-green-300 text-app-green-100 text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
          Lido
        </span>
      )}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src={coverImageURL}
              alt={title}
              className="w-24 h-32 md:w-28 md:h-36 rounded-md"
            />
          </div>
          <div className="flex flex-col flex-1 justify-between min-w-0">
            <div>
              <h3 className="text-md mt-1 font-bold text-gray-100 truncate">
                {title}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {authors.join(", ")}
              </p>
            </div>
            <div className="mt-auto">
              <Stars rateAverage={rateAverage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
