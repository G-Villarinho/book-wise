import { User } from "@/@types/user";
import { api } from "@/lib/axios";
import { createContext, ReactNode, useState } from "react";

interface SignInPayload {
  email: string;
}

interface AuthContextType {
  user: User | null;
  signIn: ({ email }: SignInPayload) => void;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextType);

interface AuthContextProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthContextProps) {
  const [user, setUser] = useState<User | null>(null);

  async function signIn({ email }: SignInPayload) {
    await api.post("auth/sign-in", { email });
  }

  async function signOut() {
    await api.post("auth/sign-out");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
