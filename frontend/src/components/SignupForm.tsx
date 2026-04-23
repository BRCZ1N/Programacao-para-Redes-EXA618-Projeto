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
  FieldGroup,
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
};

export function SignupForm({ onSubmit, ...props }: Props) {
  
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

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
    <Card {...props}>
      <CardHeader>
        <CardTitle>Crie uma conta</CardTitle>
        <CardDescription>
          Insira suas informações abaixo para criar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Nome de usuário</FieldLabel>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </Field>
            
            <Field>
              <FieldLabel htmlFor="first_name">Primeiro nome</FieldLabel>
              <Input
                id="first_name"
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="last_name">Último nome</FieldLabel>
              <Input
                id="last_name"
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FieldDescription>
                Usaremos este endereço de e-mail para entrar em contato com
                você. Não compartilharemos seu e-mail com mais ninguém.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FieldDescription>
                Deve ter pelo menos 8 caracteres.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirme sua senha
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
              <FieldDescription>
                Por favor, confirme sua senha.
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Criar conta</Button>
                <FieldDescription className="px-6 text-center">
                  Já tem uma conta? <Link to="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
