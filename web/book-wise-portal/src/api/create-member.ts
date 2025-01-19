import { api } from "@/lib/axios";

export interface CreateMemberPayload {
  fullName: string;
  email: string;
}

export async function createMember({ fullName, email }: CreateMemberPayload) {
  await api.post("/users/member", { fullName, email });
}
