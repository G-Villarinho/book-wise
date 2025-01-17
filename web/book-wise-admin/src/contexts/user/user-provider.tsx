import { getUser } from "@/api/get-user";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { UserContext } from "./user-context";

interface UserProviderProps {
  children: ReactNode;
}

export function UseProvider({ children }: UserProviderProps) {
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
