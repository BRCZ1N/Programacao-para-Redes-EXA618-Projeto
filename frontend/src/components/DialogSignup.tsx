"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";

import { Button } from "./ui/button";
import { Field, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";

const theme = {
  surface: "#121212",
  text: "#FFFFFF",
  muted: "#B3B3B3",
  border: "#2A2A2A",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoToLogin: () => void;
};

export function DialogSignup({ open, onOpenChange, onGoToLogin }: Props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [username, setUserName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://127.0.0.1:8000/api/user/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          first_name,
          last_name,
          email,
          password,
        }),
      });

      if (res.ok) {
        onOpenChange(false);
      } else {
        const data = await res.json();
        setError(data.message || "Erro ao criar conta");
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  function handleGoToLogin() {
    onOpenChange(false); 
    onGoToLogin(); 
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-0 shadow-none ring-0 outline-none"
        style={{
          width: "100%",
          maxWidth: 420,
          background: theme.surface,
          padding: 24,
          color: theme.text,
        }}
      >
        <DialogTitle
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          Criar conta
        </DialogTitle>

        <DialogDescription
          style={{
            fontSize: 13,
            color: theme.muted,
            marginBottom: 16,
          }}
        >
          Crie sua conta para começar
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field>
            <FieldLabel className="text-xs text-white">
              Nome de usuário
            </FieldLabel>
            <Input
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-[#0B0F14] border-[#2A2A2A] text-white h-9 text-sm"
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-2">
            <Field>
              <FieldLabel className="text-xs text-white">Nome</FieldLabel>
              <Input
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-[#0B0F14] border-[#2A2A2A] text-white h-9 text-sm"
                required
              />
            </Field>

            <Field>
              <FieldLabel className="text-xs text-white">Sobrenome</FieldLabel>
              <Input
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#0B0F14] border-[#2A2A2A] text-white h-9 text-sm"
                required
              />
            </Field>
          </div>

          <Field>
            <FieldLabel className="text-xs text-white">Email</FieldLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#0B0F14] border-[#2A2A2A] text-white h-9 text-sm"
              required
            />
          </Field>

          <Field>
            <FieldLabel className="text-xs text-white">Senha</FieldLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0B0F14] border-[#2A2A2A] text-white h-9 text-sm"
              required
            />
          </Field>

          <Field>
            <FieldLabel className="text-xs text-white">
              Confirmar senha
            </FieldLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#0B0F14] border-[#2A2A2A] text-white h-9 text-sm"
              required
            />
          </Field>

          {error && (
            <div className="text-xs text-red-400 border border-red-900 bg-red-950/30 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 font-bold h-9"
          >
            {loading ? "Criando..." : "Criar conta"}
          </Button>

          <div className="text-center text-xs text-gray-400">
            Já tem conta?{" "}
            <button
              type="button"
              onClick={handleGoToLogin}
              className="text-white hover:underline"
            >
              Entrar
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
