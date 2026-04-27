import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "./Fetcher";

type User = {
  username: string;
  first_name: string;
  last_name: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; 
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await apiFetch("https://programacao-para-redes-exa618-projeto.onrender.com/api/user/me/");

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      await refreshUser();
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}