import { api } from "@/lib/axios";

export interface EvaluateBookPayload {
  bookId: string;
  rate: number;
  description: string;
}

export async function evaluateBook({
  bookId,
  rate,
  description,
}: EvaluateBookPayload) {
  await api.post(`/books/${bookId}/evaluations`, { rate, description });
}
