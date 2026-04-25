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

type Props = React.ComponentProps<"div"> & {
  onSubmit: (data: { email: string; password: string }) => void;
  error?: string;
  loading?: boolean;
};

export function LoginForm({ className, onSubmit, error, loading, ...props }: Props) {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onSubmit({
      email,
      password,
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="ring-0 border-slate-800 bg-slate-900 w-full">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl font-black text-white">Faça login</CardTitle>
          <CardDescription className="text-slate-400 text-xs">
            Insira seu e-mail e senha para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
           
            <Field>
              <FieldLabel htmlFor="email" className="text-slate-200 text-xs font-semibold">
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="seu_email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                required
              />
            </Field>

           
            <Field>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel htmlFor="password" className="text-slate-200 text-xs font-semibold">
                  Senha
                </FieldLabel>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                required
              />
              <Link
                  to="/forgot-password"
                  className="text-blue-400 hover:text-blue-300 text-xs font-semibold"
                >
                  Esqueceu a senha?
                </Link>
            </Field>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-400 px-3 py-2 rounded text-xs">
                {error}
              </div>
            )}

          
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold h-9 text-sm transition-colors duration-300 mt-4"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

         
            <div className="text-center text-slate-400 text-xs">
              Não tem uma conta? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">Cadastre-se</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}