import { User } from "@/api/get-user";
import { createContext } from "react";

interface UserContextType {
  user?: User | null;
  isFetchingUser: boolean;
}

export const UserContext = createContext({} as UserContextType);
