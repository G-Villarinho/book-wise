import { User } from "@/@types/user";
import { api } from "@/lib/axios";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

const AUTH_DATA = "@BookWise:user";

interface SignInPayload {
  email: string;
}

interface AuthContextType {
  user: User | null;
  signIn: ({ email }: SignInPayload) => void;
  signOut: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({} as AuthContextType);

interface AuthContextProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthContextProps) {
  const [user, setUser] = useState<User | null>(null);

  async function signIn({ email }: SignInPayload) {
    await api.post("auth/sign-in", { email });
  }

  const loadUser = useCallback(async () => {
    const user = await fetchUser();
    localStorage.setItem(AUTH_DATA, JSON.stringify(user.data.user));
    setUser(user);
  }, []);

  async function signOut() {
    await api.post("auth/sign-out");
    setUser(null);
  }

  async function fetchUser() {
    const response = await api.get("auth/me");
    return response.data;
  }

  useEffect(() => {
    const storagedUser = localStorage.getItem(AUTH_DATA);
    if (!storagedUser) {
      loadUser();
    } else {
      setUser(JSON.parse(storagedUser));
    }
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
