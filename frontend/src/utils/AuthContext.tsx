import { createContext, useContext, useEffect, useState } from "react";

type User = {
  username: string;
  first_name: string;
  last_name: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  authenticated: false,
  loading: true,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const res = await fetch(
        "https://programacao-para-redes-exa618-projeto.onrender.com/api/user/me",
        {
          credentials: "include",
        },
      );

      if (res.ok) {
        const data = await res.json();

        setUser(data);
        setAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
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
  return useContext(AuthContext);
}
