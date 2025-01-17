import { UserContext } from "@/contexts/user/user-context";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRole?: string;
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, isFetchingUser } = useContext(UserContext);

  if (isFetchingUser) {
    return <></>;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
