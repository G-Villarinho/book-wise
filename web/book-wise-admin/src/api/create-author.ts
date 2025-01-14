import { api } from "@/lib/axios";

export interface CreateAuthorParams {
  fullName: string;
  nationality: string;
  biography: string;
  profilePicture: File;
}

export async function createAuthor({
  fullName,
  nationality,
  biography,
  profilePicture,
}: CreateAuthorParams) {
  const formData = new FormData();
  formData.append("fullName", fullName);
  formData.append("nationality", nationality);
  formData.append("biography", biography);
  formData.append("avatar_author", profilePicture);

  await api.post("/authors", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
