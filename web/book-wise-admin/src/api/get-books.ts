import { PaginationResponse } from "@/@types/pagination-response";
import { api } from "@/lib/axios";

export interface GetBooksQuery {
  page?: number | null;
  title?: string | null;
  bookId?: string | null;
  authorId?: string | null;
  categoryId?: string | null;
}

export interface BookResponse {
  id: string;
  totalPages: number;
  totalEvaluations: number;
  title: string;
  description: string;
  coverImageURL: string;
  authors: string[];
  categories: string[];
  createdAt: string;
}

export async function getBooks({
  page,
  title,
  bookId,
  authorId,
  categoryId,
}: GetBooksQuery) {
  const response = await api.get<PaginationResponse<BookResponse>>("/books", {
    params: {
      page,
      title,
      bookId,
      authorId,
      categoryId,
    },
  });

  return response.data;
}
