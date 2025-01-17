import { User } from "@/api/get-user";
import { createContext } from "react";

interface UserContextType {
  user?: User | null;
}

export const UserContext = createContext({} as UserContextType);
