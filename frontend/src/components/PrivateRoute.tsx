import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyAuth } from "../utils/Auth";

type Props = {
  children: React.ReactNode;
};

export function PrivateRoute({ children }: Props) {

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const ok = await verifyAuth();

      setAuthenticated(ok);
    }

    checkAuth();
  }, []);

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}