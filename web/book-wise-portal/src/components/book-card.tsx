import { Stars } from "@/pages/app/explore/stars";

interface BookCardProps {
  title: string;
  authors: string[];
  coverImageURL: string;
  rateAverage: number;
}

export function BookCard({
  title,
  authors,
  coverImageURL,
  rateAverage,
}: BookCardProps) {
  return (
    <div className="flex flex-row md:flex-row items-center gap-4 p-4 bg-[#181C2A] shadow rounded-lg hover:shadow-lg hover:bg-[#202638] duration-200 cursor-pointer">
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
