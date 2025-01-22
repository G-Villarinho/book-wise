import { api } from "@/lib/axios";
import { PaginateResponse } from "./interfaces/paginate-response";

export interface GetBookEvaluationsQuery {
  bookId: string;
  page?: number | null;
  limit?: number | null;
}

export interface BookEvaluationsResponse {
  id: string;
  userFullName: string;
  userAvatarUrl: string;
  rate: number;
  description: string;
  createdAt: string;
}

export async function getBookEvaluations({
  bookId,
  page,
  limit,
}: GetBookEvaluationsQuery) {
  const response = await api.get<PaginateResponse<BookEvaluationsResponse>>(
    `/books/${bookId}/evaluations`,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data;
}
