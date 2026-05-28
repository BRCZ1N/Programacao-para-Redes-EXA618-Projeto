import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function PrivateRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Outlet /> : <Navigate to="/" replace />;
}