import { api } from "@/lib/axios";

export interface GetAdminParams {
  adminId?: string;
}

export interface AdminBasicInfoResponse {
  fullName: string;
  email: string;
}

export async function getAdmin({ adminId }: GetAdminParams) {
  const response = await api.get<AdminBasicInfoResponse>(
    `/users/admins/${adminId}`
  );

  return response.data;
}
