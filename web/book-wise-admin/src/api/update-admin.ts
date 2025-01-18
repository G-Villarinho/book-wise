import { api } from "@/lib/axios";

export interface UpdateAdminPayload {
  adminId: string;
  fullName?: string | null;
  email?: string | null;
}

export async function updateAdmin({
  adminId,
  fullName,
  email,
}: UpdateAdminPayload) {
  await api.put(`/users/admins`, { adminId, fullName, email });
}
