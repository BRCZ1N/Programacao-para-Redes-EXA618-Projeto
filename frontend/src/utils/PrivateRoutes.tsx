import {Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function PrivateRoutes() {
  const { user} = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
  }

  return <Outlet />;
}
