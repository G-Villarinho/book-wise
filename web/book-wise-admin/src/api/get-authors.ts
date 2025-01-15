import { PaginationResponse } from "@/@types/pagination-response";
import { api } from "@/lib/axios";

export interface GetAuthorsQuery {
  page?: number | null;
  fullName?: string | null;
  authorId?: string | null;
}

export interface AuthorDetailsResponse {
  id: string;
  fullName: string;
  nationality: string;
  biography: string;
  avatarUrl: string;
  createdAt: string;
}

export async function getAuthors({
  page,
  fullName,
  authorId,
}: GetAuthorsQuery) {
  const response = await api.get<PaginationResponse<AuthorDetailsResponse>>(
    "/authors",
    {
      params: {
        page,
        fullName,
        authorId,
      },
    }
  );

  return response.data;
}
