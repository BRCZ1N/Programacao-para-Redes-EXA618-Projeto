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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../components/ui/field";
import { Input } from "../components/ui/input";
import { useState } from "react";

type Props = React.ComponentProps<"div"> & {
  onSubmit: (data: { email: string; password: string }) => void;
  error?: string;
};

export function LoginForm({ className, onSubmit, error, ...props }: Props) {
  
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
      <Card>
        <CardHeader>
          <CardTitle>Faça login na sua conta.</CardTitle>
          <CardDescription>
            Insira seu e-mail abaixo para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Não tem uma conta? <Link to="/signup">Cadastre-se</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
