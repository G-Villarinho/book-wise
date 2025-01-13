import { api } from "@/lib/axios";
import { BookResponse } from "./get-books";

export interface GetbookParams {
  bookId?: string;
}

export async function getBook({ bookId }: GetbookParams) {
  const response = await api.get<BookResponse>(`/books/${bookId}`);

  return response.data;
}
