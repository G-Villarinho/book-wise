import { PaginationResponse } from "@/@types/pagination-response";
import { api } from "@/lib/axios";

export interface GetAdminsQuery {
  page?: number | null;
  limit?: number | null;
  fullName?: string | null;
  status?: "all" | "active" | "blocked";
}

export interface AdminDetailsResponse {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "owner" | "member";
  avatar: string;
  status: "active" | "blocked";
  createdAt: string;
}

export async function getAdmins({ page, fullName, status }: GetAdminsQuery) {
  const response = await api.get<PaginationResponse<AdminDetailsResponse>>(
    "/users/admins",
    {
      params: {
        page,
        fullName,
        status,
      },
    }
  );

  return response.data;
}
