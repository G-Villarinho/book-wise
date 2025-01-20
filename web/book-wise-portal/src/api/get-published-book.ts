import { api } from "@/lib/axios";
import { PaginateResponse } from "@/api/interfaces/paginate-response";

export interface GetPublishdBookQuery {
  page?: number | null;
  limit?: number | null;
  q?: string | null;
  categoryId?: string | null;
}

export interface PublishedBookResponse {
  id: string;
  totalPages: string;
  totalEvaluations: number;
  rateAverage: number;
  title: string;
  coverImageURL: string;
  authors: string[];
  categories: string[];
  createdAt: string;
}

export async function getPublishedBook({
  page,
  limit,
  q,
  categoryId,
}: GetPublishdBookQuery) {
  const response = await api.get<PaginateResponse<PublishedBookResponse>>(
    "/books/published",
    {
      params: {
        page,
        limit,
        q,
        categoryId,
      },
    }
  );

  return response.data;
}
