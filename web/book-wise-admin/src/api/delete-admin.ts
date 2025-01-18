import { api } from "@/lib/axios";

export interface DeleteAdminParams {
  adminId: string;
}

export async function deleteAdmin({ adminId }: DeleteAdminParams) {
  await api.delete(`/users/admins/${adminId}`);
}
