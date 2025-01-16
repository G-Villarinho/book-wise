import { api } from "@/lib/axios";

interface CreateBookPayload {
  totalPages: number;
  title: string;
  description: string;
  coverImageURL: string;
  authorsIds: string[];
  categories: string[];
}

export async function CreateBook({
  totalPages,
  title,
  description,
  coverImageURL,
  authorsIds,
  categories,
}: CreateBookPayload) {
  await api.post("books", {
    totalPages,
    title,
    description,
    coverImageURL,
    authorsIds,
    categories,
  });
}
