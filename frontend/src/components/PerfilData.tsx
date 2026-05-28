import { useEffect, useState } from "react";
import { EditableField } from "./EditableField";
import { useAuth } from "../utils/AuthProvider";

export function PerfilData() {
  const { user, refreshUser, setUser } = useAuth();

  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        password: "",
      });
    }
  }, [user]);

  if (!user) return null;

  async function handleUpdateUser(field: string, value: string) {
    try {
      const res = await fetch(
        "https://programacao-para-redes-exa618-projeto.onrender.com/api/user/update/",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ [field]: value }),
        }
      );

      if (res.ok) {
        const updated = await res.json();

        setUser((prev) =>
          prev ? { ...prev, ...updated } : prev
        );

        refreshUser();
      }
    } catch (err) {
      console.log("Erro ao atualizar usuário:", err);
    }
  }

  return (
    <div className="space-y-6 text-white">
      <EditableField
        label="Nome de usuário"
        field="username"
        value={form.username}
        form={form}
        setForm={setForm}
        onSave={handleUpdateUser}
      />

      <EditableField
        label="Primeiro nome"
        field="first_name"
        value={form.first_name}
        form={form}
        setForm={setForm}
        onSave={handleUpdateUser}
      />

      <EditableField
        label="Último nome"
        field="last_name"
        value={form.last_name}
        form={form}
        setForm={setForm}
        onSave={handleUpdateUser}
      />

      <EditableField
        label="Senha"
        field="password"
        type="password"
        value="************"
        form={form}
        setForm={setForm}
        onSave={handleUpdateUser}
      />

      <div className="text-sm text-white/70">
        Email: {user.email}
      </div>
    </div>
  );
}