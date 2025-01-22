import { getUser, UserResponse } from "@/api/get-user";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode } from "react";

interface UserContextType {
  user?: UserResponse | null;
  isFetchingUser: boolean;
}

export const UserContext = createContext({} as UserContextType);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { data: result, isFetching } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 1000 * 60 * 15,
  });

  return (
    <UserContext.Provider value={{ user: result, isFetchingUser: isFetching }}>
      {children}
    </UserContext.Provider>
  );
}
