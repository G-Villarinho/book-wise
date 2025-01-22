import { api } from "@/lib/axios";

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatar: string;
}

export async function getUser() {
  const response = await api.get<UserResponse>("/users/me");

  return response.data;
}
