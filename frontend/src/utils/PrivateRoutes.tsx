import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function PrivateRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}