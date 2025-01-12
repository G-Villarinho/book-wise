import { SearchBookResponse } from "@/@types/search-book-response";
import { api } from "@/lib/axios";

export interface SearchBookQuery {
  page?: number | null;
  authorOrTitle?: string | null;
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
