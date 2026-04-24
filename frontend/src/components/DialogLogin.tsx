import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { LoginForm } from "./LoginForm";

export function DialogLogin({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [error, setError] = useState("");

  async function handleLogin(data: { email: string; password: string }) {
    try {
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        onOpenChange(false); 
        window.location.href = "/dashboard"; 
      } else {
        setError("Email ou senha inválidos");
      }
    } catch (error) {
      console.log("Erro:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 border-0 shadow-none">
        <LoginForm onSubmit={handleLogin} error={error} />
      </DialogContent>
    </Dialog>
  );
}