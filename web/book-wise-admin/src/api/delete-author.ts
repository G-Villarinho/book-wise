import { api } from "@/lib/axios";

export interface DeleteAuthorParams {
  authorId: string;
}

export async function deleteAuthor({ authorId }: DeleteAuthorParams) {
  await api.delete(`/authors/${authorId}`);
}
