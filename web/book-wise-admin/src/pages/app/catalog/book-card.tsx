import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface BookCardProps {
  title: string;
  authors: string[];
  description: string;
  coverImageUrl: string;
}

export function BookCard({
  title,
  authors,
  description,
  coverImageUrl,
}: BookCardProps) {
  return (
    <Card className="max-w-[220px] rounded-lg border bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      {/* Card Header com a capa do livro */}
      <CardHeader className="relative overflow-hidden rounded-t-lg">
        <img
          src={coverImageUrl}
          alt={title}
          className="w-full h-[300px] object-cover rounded-t-lg shadow-md"
        />
      </CardHeader>

      {/* Detalhes do livro */}
      <CardContent className="p-3 text-center">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <span className="text-sm text-gray-600">{authors.join(", ")}</span>
        <p className="text-xs text-gray-500 mt-2 line-clamp-3">{description}</p>
      </CardContent>

      {/* Adicionando um efeito de "livro" com a borda lateral */}
      <div className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-r from-transparent via-transparent to-gray-200 rounded-tr-lg" />
    </Card>
  );
}
