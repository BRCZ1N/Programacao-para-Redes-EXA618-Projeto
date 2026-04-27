import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { EditableField } from "./EditableField";
import { useAuth } from "../utils/AuthProvider";

const inputClass =
  "bg-[#121212] border border-[#2A2A2A] text-white placeholder:text-white/30 " +
  "hover:bg-[#161616] focus:bg-[#161616] focus:border-[#3A3A3A] " +
  "focus:ring-0 transition rounded-md";

export function PerfilData() {
  const { user, setUser } = useAuth(); // 🔥 opção 1
  const [editing, setEditing] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
  });

  // 🔥 sincroniza form quando user carregar
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

  async function handleUpdateUser(data: Partial<typeof form>) {
    try {
      const res = await fetch("http://localhost:8000/api/user/update/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();

        setUser(updated);

        setForm({
          username: updated.username,
          first_name: updated.first_name,
          last_name: updated.last_name,
          password: "",
        });
      }
    } catch (err) {
      console.log("Erro ao atualizar usuário:", err);
    }
  }

  function handleSave(field: keyof typeof form) {
    handleUpdateUser({ [field]: form[field] });
    setEditing(null);
  }

  return (
    <div className="space-y-6 text-white">

      <EditableField
        label="Nome de usuário"
        value={form.username}
        editing={editing === "username"}
        onEdit={() => setEditing("username")}
        onCancel={() => setEditing(null)}
        onSave={() => handleSave("username")}
      >
        <Input
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
          className={inputClass}
        />
      </EditableField>

      <EditableField
        label="Primeiro nome"
        value={form.first_name}
        editing={editing === "first_name"}
        onEdit={() => setEditing("first_name")}
        onCancel={() => setEditing(null)}
        onSave={() => handleSave("first_name")}
      >
        <Input
          value={form.first_name}
          onChange={(e) =>
            setForm({ ...form, first_name: e.target.value })
          }
          className={inputClass}
        />
      </EditableField>

      <EditableField
        label="Último nome"
        value={form.last_name}
        editing={editing === "last_name"}
        onEdit={() => setEditing("last_name")}
        onCancel={() => setEditing(null)}
        onSave={() => handleSave("last_name")}
      >
        <Input
          value={form.last_name}
          onChange={(e) =>
            setForm({ ...form, last_name: e.target.value })
          }
          className={inputClass}
        />
      </EditableField>

      <EditableField
        label="Email"
        value={user.email}
        editing={false}
        onEdit={() => {}}
        hideEdit
      />

      <EditableField
        label="Senha"
        value="************"
        editing={editing === "password"}
        onEdit={() => setEditing("password")}
        onCancel={() => setEditing(null)}
        onSave={() => handleSave("password")}
      >
        <Input
          type="password"
          placeholder="Nova senha"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          className={inputClass}
        />
      </EditableField>
    </div>
  );
}