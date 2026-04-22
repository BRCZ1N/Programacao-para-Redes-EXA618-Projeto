import { LoginForm } from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Login() {
  const navigate = useNavigate();

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
        navigate("/dashboard");
      } else {
        setError("Email ou senha inválidos");
      }
    } catch (error) {
      console.log("Erro na requisição:", error);
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={handleLogin} error={error} />
      </div>
    </div>
  );
}
