import {Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Spinner } from "../components/ui/spinner";

export function PublicRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black">
        <Spinner className="size-8 text-white" />
      </div>
    );
  }

  return <Outlet />;
}
