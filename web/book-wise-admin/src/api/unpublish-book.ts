import { api } from "@/lib/axios";

export interface UnpublishBookParams {
  bookId: string;
}

export async function unpublishBook({ bookId }: UnpublishBookParams) {
  await api.patch(`/books/${bookId}/unpublish`);
}
