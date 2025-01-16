import { getUser, User } from "@/api/get-user";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode } from "react";

interface UserContextType {
  user?: User | null;
}

export const UserContext = createContext({} as UserContextType);

interface UserProviderProps {
  children: ReactNode;
}

export function UseProvider({ children }: UserProviderProps) {
  const { data: result } = useQuery({ queryKey: ["user"], queryFn: getUser });

  return (
    <UserContext.Provider value={{ user: result }}>
      {children}
    </UserContext.Provider>
  );
}
