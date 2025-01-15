import { api } from "@/lib/axios";

export interface AuthorResponse {
  id: string;
  fullName: string;
  avatarUrl: string;
}

export async function GetAuthorsBasicInfo() {
  const response = await api.get<AuthorResponse[]>("/authors/lite");
  return response.data;
}
