import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export function PrivateRoute() {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}