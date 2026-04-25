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
    <div className="flex flex-col gap-6 text-white">
      
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">Informações</h3>
        <p className="text-xs text-slate-400">
          Defina os dados básicos da sua playlist
        </p>
      </div>

      
      <div className="space-y-3">
        <Input
          placeholder="Título"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          className="
            bg-slate-900/60
            border border-slate-800/60
            text-white
            placeholder:text-slate-500
            focus:border-blue-500/50
            focus:ring-2 focus:ring-blue-500/20
            transition
          "
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
          className="
            bg-slate-900/60
            border border-slate-800/60
            text-white
            placeholder:text-slate-500
            focus:border-blue-500/50
            focus:ring-2 focus:ring-blue-500/20
            transition
          "
        />
      </div>

      
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/30 p-3">
        <PlaylistFilters form={form} setForm={setForm} />
      </div>

      
      <Button
        onClick={handleSubmit}
        className="
          w-full
          bg-blue-600
          hover:bg-blue-500
          text-white
          font-medium
          shadow-md shadow-blue-500/20
          transition
        "
      >
        Gerar Playlist
      </Button>
    </div>
  );
}