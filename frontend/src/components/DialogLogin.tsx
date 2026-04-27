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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

const theme = {
  surface: "#121212",
  text: "#FFFFFF",
  muted: "#B3B3B3",
};

const fieldClass =
  "bg-slate-800 border border-slate-700 text-white placeholder-slate-500 " +
  "focus:border-blue-500 focus:ring-blue-500 h-9 text-sm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoToSignup: () => void;
};

export function DialogLogin({
  open,
  onOpenChange,
  onGoToSignup,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://programacao-para-redes-exa618-projeto.onrender.com/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        await refreshUser();
        onOpenChange(false);
        
        navigate("/dashboard/games");
      } else if (response.status === 401) {
        setError("Email ou senha inválidos");
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao fazer login");
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
        className="border-0 shadow-none ring-0 outline-none"
        style={{
          width: "100%",
          maxWidth: 360,
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

        <div className="space-y-3">

      
          <Field>
            <FieldLabel className="text-slate-200 text-xs font-semibold">
              Email
            </FieldLabel>

            <Input
              type="email"
              placeholder="seu_email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              required
            />
          </Field>

        
          <Field>
            <FieldLabel className="text-slate-200 text-xs font-semibold">
              Senha
            </FieldLabel>

            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
              required
            />
          </Field>

        
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 px-3 py-2 rounded text-xs">
              {error}
            </div>
          )}

          
          <Button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 font-bold h-9 text-sm"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

      
          <div
            style={{
              textAlign: "center",
              fontSize: 12,
              color: theme.muted,
              marginTop: 12,
            }}
          >
            Não tem uma conta?{" "}
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onGoToSignup();
              }}
              style={{
                color: theme.text,
                fontWeight: 600,
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cadastre-se
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}