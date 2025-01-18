import { api } from "@/lib/axios";

export interface BlockAdminPayload {
  adminId: string;
}

export async function blockAdmin({ adminId }: BlockAdminPayload) {
  await api.patch("/users/admin/block", { adminId });
}
