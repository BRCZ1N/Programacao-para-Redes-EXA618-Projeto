"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";

import { LoginForm } from "./LoginForm";
import { useNavigate } from "react-router-dom";

const theme = {
  surface: "#121212",
  text: "#FFFFFF",
  muted: "#B3B3B3",
};

export function DialogLogin({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(data: { email: string; password: string }) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        onOpenChange(false);
        navigate("/dashboard");
      } else if (response.status === 401) {
        setError("Email ou senha inválidos");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erro ao fazer login");
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          width: "100%",
          maxWidth: 360,
          background: theme.surface,

          padding: 24,
          color: theme.text,

          border: "none",
          boxShadow: "none",
        }}
      >
        <DialogTitle
          style={{
            fontSize: 18,
            fontWeight: 800,
            marginBottom: 4,
          }}
        >
          Entrar
        </DialogTitle>

        <DialogDescription
          style={{
            fontSize: 13,
            color: theme.muted,
            marginBottom: 12,
          }}
        >
          Acesse sua conta para continuar
        </DialogDescription>

        <LoginForm
          onSubmit={handleLogin}
          error={error}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}