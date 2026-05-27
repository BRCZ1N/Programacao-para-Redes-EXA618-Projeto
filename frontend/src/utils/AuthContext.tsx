import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

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
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  authenticated: false,
  loading: true,
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("https://programacao-para-redes-exa618-projeto.onrender.com/api/user/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();

          setUser(data);
          setAuthenticated(true);
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}