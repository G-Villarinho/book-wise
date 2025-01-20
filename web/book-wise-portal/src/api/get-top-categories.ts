import { api } from "@/lib/axios";

export interface TopCategoryResponse {
  id: string;
  name: string;
}

export async function getTopCategories() {
  const response = await api.get<TopCategoryResponse[]>("/categories/top");
  return response.data;
}
