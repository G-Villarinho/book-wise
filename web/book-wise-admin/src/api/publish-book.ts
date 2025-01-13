import { api } from "@/lib/axios";

export interface PublishBookParams {
  bookId: string;
}

export async function publishBook({ bookId }: PublishBookParams) {
  await api.patch(`/books/${bookId}/publish`);
}
