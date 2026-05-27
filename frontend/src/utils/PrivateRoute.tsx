import {Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Spinner } from "../components/ui/spinner";

export function PrivateRoute() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center gap-6 bg-black w-full">
        <Spinner className="size-8 bg-white" />
      </div>
    );
  }

  if (!user) {
    navigate("/");
  }

  return <Outlet />;
}
