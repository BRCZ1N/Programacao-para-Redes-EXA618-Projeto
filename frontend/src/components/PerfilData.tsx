import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { EditableField } from "./EditableField";

type User = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};

export function PerfilData() {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  
  async function loadUser() {
    try {
      let response = await fetch("http://localhost:8000/api/user/me/", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        const refreshResponse = await fetch(
          "http://localhost:8000/api/auth/refresh/",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (refreshResponse.ok) {
          response = await fetch("http://localhost:8000/api/user/me/", {
            method: "GET",
            credentials: "include",
          });
        }
      }

      if (response.ok) {
        const data = await response.json();

        setUser(data);
        setForm({
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          password: "",
        });
      }
    } catch (error) {
      console.log("Erro:", error);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function handleUpdateUser(data: Partial<typeof form>) {
    try {
      let response = await fetch("http://localhost:8000/api/user/update/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        const refreshResponse = await fetch(
          "http://localhost:8000/api/auth/refresh/",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (refreshResponse.ok) {
          response = await fetch(
            "http://localhost:8000/api/user/update/",
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(data),
            }
          );
        }
      }

      if (response.ok) {
        const updatedUser = await response.json();

        
        setUser(updatedUser);

        setForm({
          username: updatedUser.username,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          password: "",
        });
      }
    } catch (error) {
      console.log("Erro ao atualizar usuário:", error);
    }
  }

  function handleSave(field: keyof typeof form) {
    handleUpdateUser({ [field]: form[field] });
    setEditing(null);
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      
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
        />
      </EditableField>
    </div>
  );
}