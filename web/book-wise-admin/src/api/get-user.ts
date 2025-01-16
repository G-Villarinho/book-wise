import { api } from "@/lib/axios";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatar: string;
}

export async function getUser() {
  const response = await api.get<User>("/users/me");

  return response.data;
}
