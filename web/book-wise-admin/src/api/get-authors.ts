import { api } from "@/lib/axios";

export interface AuthorResponse {
  id: string;
  fullName: string;
}

export async function GetAuthors() {
  const response = await api.get<AuthorResponse[]>("/authors");
  return response.data;
}
