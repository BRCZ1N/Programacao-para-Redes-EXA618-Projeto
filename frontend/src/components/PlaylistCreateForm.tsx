"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PlaylistFilters } from "./PlaylistFilters";

type Props = {
  onSuccess?: (playlist: any) => void;
};

export function PlaylistCreateForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tag: [] as string[],
    rating: [5],
    price: [0],
    reviews: [0],
  });

  async function handleSubmit() {
  const payload = {
    title: form.title,
    description: form.description,
    tag: form.tag,
    min_rating: form.rating[0],
    min_value: form.price[0],
    min_review: form.reviews[0],
  };

  try {
    const res = await fetch("http://localhost:8000/api/playlist/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Erro ao criar playlist");

    const data = await res.json();

    onSuccess?.(data);

    
    setForm({
      title: "",
      description: "",
      tag: [],
      rating: [5],
      price: [0],
      reviews: [0],
    });

  } catch (err) {
    console.log("Erro:", err);
  }
}

  return (
    <div className="flex flex-col gap-6">

      {/* INFO */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Informações</h3>

        <Input
          placeholder="Título"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />

        <Input
          placeholder="Descrição"
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </div>

      {/* FILTROS */}
      <PlaylistFilters form={form} setForm={setForm} />

      {/* SUBMIT */}
      <Button onClick={handleSubmit} className="w-full">
        Gerar Playlist
      </Button>
    </div>
  );
}