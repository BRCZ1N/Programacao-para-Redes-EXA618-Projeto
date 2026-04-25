import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "../components/ui/field";
import { Input } from "../components/ui/input";
import { useState } from "react";

type Props = React.ComponentProps<typeof Card> & {
  onSubmit: (data: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => void;
  error?: string;
  loading?: boolean;
};

export function SignupForm({ onSubmit, error, loading, ...props }: Props) {
  
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onSubmit({
      email,
      password,
      username,
      last_name,
      first_name,
    });
  }

  return (
    <Card className="ring-0 border-slate-800 bg-slate-900 w-full" {...props}>
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-black text-white">Crie uma conta</CardTitle>
        <CardDescription className="text-slate-400 text-xs">
          Insira suas informações para criar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          
          <Field>
            <FieldLabel htmlFor="username" className="text-slate-200 text-xs font-semibold">
              Nome de usuário
            </FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="seu_usuario"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
              required
            />
          </Field>

       
          <div className="grid grid-cols-2 gap-2">
            <Field>
              <FieldLabel htmlFor="first_name" className="text-slate-200 text-xs font-semibold">
                Primeiro nome
              </FieldLabel>
              <Input
                id="first_name"
                type="text"
                placeholder="João"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="last_name" className="text-slate-200 text-xs font-semibold">
                Último nome
              </FieldLabel>
              <Input
                id="last_name"
                type="text"
                placeholder="Silva"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                required
              />
            </Field>
          </div>

       
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
            <FieldDescription className="text-slate-500 text-xs mt-1">
              Usaremos este e-mail para contato.
            </FieldDescription>
          </Field>

         
          <Field>
            <FieldLabel htmlFor="password" className="text-slate-200 text-xs font-semibold">
              Senha
            </FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
              required
            />
            <FieldDescription className="text-slate-500 text-xs mt-1">
              Mínimo 8 caracteres.
            </FieldDescription>
          </Field>

         
          <Field>
            <FieldLabel htmlFor="confirm-password" className="text-slate-200 text-xs font-semibold">
              Confirme sua senha
            </FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
              required
            />
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
            {loading ? "Criando..." : "Criar conta"}
          </Button>

          
          <div className="text-center text-slate-400 text-xs">
            Já tem uma conta? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">Sign in</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}