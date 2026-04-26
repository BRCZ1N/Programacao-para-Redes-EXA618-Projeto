import { cn } from "../lib/utils";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Field, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";
import { useState } from "react";

const theme = {
  bg: "#000000",
  surface: "#121212",
  border: "#2A2A2A",
  text: "#FFFFFF",
  muted: "#B3B3B3",
  accent: "#1DB954",
};

type Props = React.ComponentProps<"div"> & {
  onSubmit: (data: { email: string; password: string }) => void;
  error?: string;
  loading?: boolean;
};

export function LoginForm({
  className,
  onSubmit,
  error,
  loading,
  ...props
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ email, password });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card
        style={{
          background: theme.surface,
        
        }}
      >


        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* EMAIL */}
            <Field>
              <FieldLabel
                htmlFor="email"
                className="text-xs font-semibold"
                style={{ color: theme.muted }}
              >
                Email
              </FieldLabel>

              <Input
                id="email"
                type="email"
                placeholder="seu_email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: "#000",
                  color: theme.text,
                  height: 36,
                  fontSize: 13,
                }}
                required
              />
            </Field>

            {/* PASSWORD */}
            <Field>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-semibold"
                  style={{ color: theme.muted }}
                >
                  Senha
                </FieldLabel>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: "#000",
                  color: theme.text,
                  height: 36,
                  fontSize: 13,
                }}
                required
              />

              <Link
                to="/forgot-password"
                style={{
                  color: theme.muted,
                  fontSize: 11,
                  display: "inline-block",
                  marginTop: 6,
                }}
              >
                Esqueceu a senha?
              </Link>
            </Field>

            {/* ERROR */}
            {error && (
              <div
                style={{
                  background: "rgba(255, 0, 0, 0.08)",
                  border: "1px solid rgba(255, 0, 0, 0.3)",
                  color: "#ff6b6b",
                  padding: "8px 10px",
                  borderRadius: 6,
                  fontSize: 11,
                }}
              >
                {error}
              </div>
            )}

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: theme.text,
                color: "#000",
                fontWeight: 700,
                height: 36,
                fontSize: 13,
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            {/* SIGNUP */}
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                color: theme.muted,
              }}
            >
              Não tem uma conta?{" "}
              <Link
                to="/signup"
                style={{
                  color: theme.text,
                  fontWeight: 600,
                }}
              >
                Cadastre-se
              </Link>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}