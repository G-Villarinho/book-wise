import { api } from "@/lib/axios";

export interface CreateAdminPayload {
  fullName: string;
  email: string;
}

export async function createAdmin({ fullName, email }: CreateAdminPayload) {
  await api.post("/users/admin", { fullName, email });
}
