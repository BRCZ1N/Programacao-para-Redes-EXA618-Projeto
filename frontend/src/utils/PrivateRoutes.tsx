import {Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Spinner } from "../components/ui/spinner";

export function PrivateRoutes() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black">
        <Spinner className="size-8 text-white" />
      </div>
    );
  }

  if (!user) {
    navigate("/");
  }

  return <Outlet />;
}
