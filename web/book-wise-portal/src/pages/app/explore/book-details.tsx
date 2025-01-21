import { useState } from "react";
import { BookDetailsCard } from "./book-details-card";
import { BookEvaluationCard } from "./book-evaluation-card";
import { useQuery } from "@tanstack/react-query";
import { getBookEvaluations } from "@/api/get-book-evaluations";

interface BookDetailsProps {
  book: {
    id: string;
    title: string;
    authors: string[];
    totalEvaluations: number;
    categories: string[];
    coverImageURL: string;
    rateAverage: number;
    totalPages: string;
  };
}

export function BookDetails({ book }: BookDetailsProps) {
  const [page] = useState(1);

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
          <span>Nenhum avaliação encontrada!</span>
        )}
      </div>
    </div>
  );
}
