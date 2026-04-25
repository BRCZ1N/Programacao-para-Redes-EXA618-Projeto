import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { LoginForm } from "./LoginForm";
import { useNavigate } from "react-router-dom";

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
    } catch (error) {
      console.log("Erro:", error);
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xs bg-slate-900 border border-slate-800 p-4 sm:p-6 [&>button]:text-slate-400 [&>button]:hover:text-white [&>button]:hover:bg-slate-800 [&>button]:rounded-md [&>button]:transition">
        <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
      </DialogContent>
      <DialogTitle />
      <DialogDescription />
    </Dialog>
  );
}
