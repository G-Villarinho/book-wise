import { api } from "@/lib/axios";

export interface UnblockAdminPayload {
  adminId: string;
}

export async function unblockAdmin({ adminId }: UnblockAdminPayload) {
  await api.patch("/users/admins/unblock", { adminId });
}
