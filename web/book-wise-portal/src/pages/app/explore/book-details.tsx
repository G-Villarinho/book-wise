import { useState } from "react";
import { BookDetailsCard } from "./book-details-card";
import { BookEvaluationCard } from "./book-evaluation-card";
import { useQuery } from "@tanstack/react-query";
import { getBookEvaluations } from "@/api/get-book-evaluations";
import { Button } from "@/components/ui/button";
import { CreateEvaluationForm } from "./create-evaluation-form";
import { Star } from "lucide-react";

interface BookDetailsProps {
  book: {
    id: string;
    title: string;
    authors: string[];
    totalEvaluations: number;
    hasRead: boolean;
    categories: string[];
    coverImageURL: string;
    rateAverage: number;
    totalPages: string;
  };
}

export function BookDetails({ book }: BookDetailsProps) {
  const [page] = useState(1);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);

  const { data: result } = useQuery({
    queryKey: ["evaluations", page],
    queryFn: () => getBookEvaluations({ bookId: book.id, page, limit: 5 }),
  });

  return (
    <div className="mt-5">
      <BookDetailsCard
        title={book.title}
        authors={book.authors}
        totalEvaluations={book.totalEvaluations}
        categories={book.categories}
        coverImageURL={book.coverImageURL}
        rateAverage={book.rateAverage}
        totalPages={book.totalPages}
      />

      <div className="mt-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-app-gray-200 text-sm font-thin">Avaliações</h2>
          {!book.hasRead && !showEvaluationForm && (
            <Button variant="ghost" onClick={() => setShowEvaluationForm(true)}>
              Avaliar
            </Button>
          )}
        </div>

        {showEvaluationForm && (
          <CreateEvaluationForm
            bookId={book.id}
            onClose={() => setShowEvaluationForm(false)}
          />
        )}
        {result &&
          result.data.map((evaluation) => {
            return (
              <BookEvaluationCard
                key={evaluation.id}
                userFullName={evaluation.userFullName}
                userAvatarUrl={evaluation.userAvatarUrl}
                rate={evaluation.rate}
                description={evaluation.description}
                createdAt={evaluation.createdAt}
              />
            );
          })}

        {result && result.data.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-12 text-app-gray-300">
            <Star size={48} className="mb-4 text-app-purple-200" />
            <p className="text-lg font-semibold">Sem avaliações ainda!</p>
            <p className="text-sm text-app-gray-400">
              Seja o primeiro a compartilhar sua opinião sobre este livro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
