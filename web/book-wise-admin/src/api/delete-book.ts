import { api } from "@/lib/axios";

export interface deleteBookParams {
  bookId: string;
}

export async function deleteBook({ bookId }: deleteBookParams) {
  await api.delete(`/books/${bookId}`);
}
