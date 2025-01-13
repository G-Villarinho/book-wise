import { api } from "@/lib/axios";

export interface CategoryResponse {
  id: string;
  name: string;
}

export async function GetCategories() {
  const response = await api.get<CategoryResponse[]>("/categories");

  return response.data;
}
