import placeholder from "@/assets/book-placeholder.png";
import { useNavigate } from "react-router-dom";

interface BookCardProps {
  externalBookId: string;
  coverImageUrl: string;
}

export function BookCard({ externalBookId, coverImageUrl }: BookCardProps) {
  const navigate = useNavigate();
  const image = coverImageUrl !== "" ? coverImageUrl : placeholder;

  function handleClick() {
    navigate(`/book/new/${externalBookId}`);
  }

  return (
    <a
      onClick={handleClick}
      className="relative max-w-[220px] rounded-lg bg-white shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer group"
    >
      <div className="relative">
        <img
          src={image}
          alt="Capa do livro"
          className="w-full h-[300px] object-cover rounded-t-lg shadow-md"
        />

        <div className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-r from-transparent via-transparent to-gray-200 rounded-tr-lg" />
      </div>

      <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-gray-300 rounded-lg z-10" />

      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-90 flex items-center justify-center transition-opacity duration-200 z-20">
        <span className="text-sm font-bold text-gray-800">
          Adicionar livro ao portal
        </span>
      </div>
    </a>
  );
}
