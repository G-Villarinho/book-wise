import { api } from "@/lib/axios";

export interface SearchBookQuery {
  page?: number | null;
  authorOrTitle?: string | null;
}

interface SearchBookResponse {
  key: string;
  totalPages: number;
  title: string;
  description: string;
  coverImageURL: string;
  authors: string[];
  categories: string[];
}

export async function searchExternalBooks({
  authorOrTitle,
  page,
}: SearchBookQuery) {
  const response = await api.get<SearchBookResponse[]>(
    "books/external/search",
    {
      params: {
        q: authorOrTitle || "",
        page: page,
      },
    }
  );

  return response.data;
}
