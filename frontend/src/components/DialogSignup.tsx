import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { SignupForm } from "./SignupForm";

export function DialogSignup({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(data: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://127.0.0.1:8000/api/user/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        onOpenChange(false);
      } else if (res.status === 404) {
        setError("Erro ao registrar usuário");
      } else if (res.status === 400) {
        const errorData = await res.json();
        setError(errorData.message || "Dados inválidos");
      } else {
        setError("Não foi possível criar a conta");
      }
    } catch (err) {
      console.log(err);
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xs bg-slate-900 border border-slate-800 p-4 sm:p-6 [&>button]:text-slate-400 [&>button]:hover:text-white [&>button]:hover:bg-slate-800/60 [&>button]:rounded-md [&>button]:transition">
        <SignupForm onSubmit={handleSignup} error={error} loading={loading} />
      </DialogContent>
      <DialogTitle />
      <DialogDescription />
    </Dialog>
  );
}