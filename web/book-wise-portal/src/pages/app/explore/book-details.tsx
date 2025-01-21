import { Stars } from "@/components/stars";
import { Bookmark, BookOpen } from "lucide-react";
import { BookDetailsCard } from "./book-details-card";

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
    <BookDetailsCard
      title={title}
      authors={authors}
      totalEvaluations={totalEvaluations}
      categories={categories}
      coverImageURL={coverImageURL}
      rateAverage={rateAverage}
      totalPages={totalPages}
    />
  );
}
