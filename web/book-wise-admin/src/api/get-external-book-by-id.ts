import { SearchBookResponse } from "@/@types/search-book-response";
import { api } from "@/lib/axios";

export async function getExternalBookById(externalBookId: string) {
  const response = await api.get<SearchBookResponse>(
    `books/external/${externalBookId}`
  );

  return response.data;
}
