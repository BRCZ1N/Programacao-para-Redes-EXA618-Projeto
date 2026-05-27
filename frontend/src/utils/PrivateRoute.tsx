import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}