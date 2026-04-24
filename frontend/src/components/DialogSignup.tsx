import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { SignupForm } from "./SignupForm";

export function DialogSignup({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [error, setError] = useState("");

  async function handleSignup(data: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        onOpenChange(false);
      } else if (res.status === 404) {
        setError("Erro ao registrar usuário");
      } else {
        setError("Não foi possível criar a conta");
      }
    } catch (err) {
      console.log(err);
      setError("Erro de conexão");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <SignupForm onSubmit={handleSignup} error={error} />
      </DialogContent>
    </Dialog>
  );
}