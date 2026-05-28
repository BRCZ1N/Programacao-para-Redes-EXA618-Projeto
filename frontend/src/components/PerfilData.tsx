import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { EditableField } from "./EditableField";
import { useAuth } from "../utils/AuthProvider";

const inputClass =
  "bg-[#121212] border border-[#2A2A2A] text-white placeholder:text-white/30 " +
  "hover:bg-[#161616] focus:bg-[#161616] focus:border-[#3A3A3A] " +
  "focus:ring-0 transition rounded-md";

export function PerfilData() {
  const { user, refreshUser, setUser } = useAuth();

  const [editing, setEditing] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
  });

  const [draft, setDraft] = useState({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      const data = {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        password: "",
      };

      setForm(data);
      setDraft(data);
    }
  }, [user]);

  if (!user) return null;

  async function handleUpdateUser(data: Partial<typeof form>) {
    try {
      const res = await fetch(
        "https://programacao-para-redes-exa618-projeto.onrender.com/api/user/update/",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (res.ok) {
        const updated = await res.json();

        setUser((prev) =>
          prev
            ? {
                ...prev,
                ...updated,
              }
            : prev
        );

        refreshUser();
      }
    } catch (err) {
      console.log("Erro ao atualizar usuário:", err);
    }
  }

  function handleSave(field: keyof typeof form) {
    handleUpdateUser({ [field]: draft[field] });

    setForm((prev) => ({
      ...prev,
      [field]: draft[field],
    }));

    setEditing(null);
  }

  return (
    <div className="space-y-6 text-white">
      <EditableField
        label="Nome de usuário"
        value={form.username}
        editing={editing === "username"}
        onEdit={() => {
          setDraft((prev) => ({
            ...prev,
            username: form.username,
          }));
          setEditing("username");
        }}
        onCancel={() => {
          setDraft((prev) => ({
            ...prev,
            username: form.username,
          }));
          setEditing(null);
        }}
        onSave={() => handleSave("username")}
        canSave={draft.username.trim().length > 0}
      >
        <Input
          value={draft.username}
          onChange={(e) =>
            setDraft({ ...draft, username: e.target.value })
          }
          className={inputClass}
        />
      </EditableField>

      <EditableField
        label="Primeiro nome"
        value={form.first_name}
        editing={editing === "first_name"}
        onEdit={() => {
          setDraft((prev) => ({
            ...prev,
            first_name: form.first_name,
          }));
          setEditing("first_name");
        }}
        onCancel={() => {
          setDraft((prev) => ({
            ...prev,
            first_name: form.first_name,
          }));
          setEditing(null);
        }}
        onSave={() => handleSave("first_name")}
        canSave={draft.first_name.trim().length > 0}
      >
        <Input
          value={draft.first_name}
          onChange={(e) =>
            setDraft({ ...draft, first_name: e.target.value })
          }
          className={inputClass}
        />
      </EditableField>

      <EditableField
        label="Último nome"
        value={form.last_name}
        editing={editing === "last_name"}
        onEdit={() => {
          setDraft((prev) => ({
            ...prev,
            last_name: form.last_name,
          }));
          setEditing("last_name");
        }}
        onCancel={() => {
          setDraft((prev) => ({
            ...prev,
            last_name: form.last_name,
          }));
          setEditing(null);
        }}
        onSave={() => handleSave("last_name")}
        canSave={draft.last_name.trim().length > 0}
      >
        <Input
          value={draft.last_name}
          onChange={(e) =>
            setDraft({ ...draft, last_name: e.target.value })
          }
          className={inputClass}
        />
      </EditableField>

      <EditableField
        label="Senha"
        value="************"
        editing={editing === "password"}
        onEdit={() => {
          setDraft((prev) => ({
            ...prev,
            password: "",
          }));
          setEditing("password");
        }}
        onCancel={() => {
          setDraft((prev) => ({
            ...prev,
            password: "",
          }));
          setEditing(null);
        }}
        onSave={() => handleSave("password")}
        canSave={draft.password.trim().length > 0}
      >
        <Input
          type="password"
          placeholder="Nova senha"
          value={draft.password}
          onChange={(e) =>
            setDraft({ ...draft, password: e.target.value })
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
    </div>
  );
}