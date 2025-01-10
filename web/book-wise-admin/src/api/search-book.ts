import { api } from "@/lib/axios";

export interface SearchBookQuery {
  page?: number | null;
  authorOrTitle?: string | null;
}

interface SearchBookResponse {
  totalPages: number;
  title: string;
  description: string;
  coverImageURL: string;
  authors: string[];
  categories: string[];
}

export async function searchBooks({ authorOrTitle, page }: SearchBookQuery) {
  const response = await api.get<SearchBookResponse[]>("books/search", {
    params: {
      q: authorOrTitle || "",
      page: page,
    },
  });

  return response.data;
}
