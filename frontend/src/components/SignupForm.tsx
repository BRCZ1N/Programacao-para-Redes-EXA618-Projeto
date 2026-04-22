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
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
};

export function SignupForm({ onSubmit, ...props }: Props) {
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onSubmit({
      email,
      password,
      lastName,
      firstName,
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
              <FieldLabel htmlFor="firstName">Primeiro nome</FieldLabel>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">Último nome</FieldLabel>
              <Input
                id="lastName"
                type="text"
                value={lastName}
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
