import placeholer from "../../../assets/book-placeholder.png";

interface BookCardProps {
  coverImageUrl: string;
}

export function BookCard({ coverImageUrl }: BookCardProps) {
  const image = coverImageUrl !== "" ? coverImageUrl : placeholer;

  return (
    <div className="relative max-w-[220px] rounded-lg bg-white shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
      <div className="relative">
        <img
          src={image}
          alt="Capa do livro"
          className="w-full h-[300px] object-cover rounded-t-lg shadow-md"
        />

        <div className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-r from-transparent via-transparent to-gray-200 rounded-tr-lg" />
      </div>

      <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-gray-300 rounded-lg z-10" />
    </div>
  );
}
