"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SliderBlock } from "./SliderBlock";
import { TagsInput } from "./TagsInput";

type Props = {
  onSuccess?: (playlist: any) => void;
};

const theme = {
  bg: "#000000",
  card: "#0F0F0F",
  border: "#262626",
  text: "#FFFFFF",
  muted: "#A3A3A3",
  accent: "#FFFFFF",
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
      const res = await fetch("https://programacao-para-redes-exa618-projeto.onrender.com/api/playlist/", {
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
    <div className="flex flex-col gap-5 text-white">

      <div>
        <h2 className="text-base font-semibold">Criar playlist</h2>
        <p className="text-xs text-neutral-400">
          Configure os filtros da sua playlist
        </p>
      </div>

      <div
        style={{
          background: theme.card,
          
        }}
        className="flex flex-col gap-3 p-4 rounded-lg"
      >
        <Input
          placeholder="Título"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          className="bg-black border border-neutral-800 text-white placeholder:text-neutral-500"
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
          className="bg-black border border-neutral-800 text-white placeholder:text-neutral-500"
        />
      </div>

      <div
        style={{
          background: theme.card,
        }}
        className="flex flex-col gap-4 p-4 rounded-lg"
      >
        <div>
          <h3 className="text-sm font-medium">Filtros</h3>
          <p className="text-xs text-neutral-500">
            Refine os jogos da sua playlist
          </p>
        </div>

        <TagsInput
          value={form.tag}
          onChange={(tag) =>
            setForm((prev) => ({ ...prev, tag }))
          }
        />

        <SliderBlock
          label="Rating mínimo"
          value={form.rating}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, rating: value }))
          }
          min={0}
          max={10}
        />

        <SliderBlock
          label="Preço mínimo"
          value={form.price}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, price: value }))
          }
          min={0}
          max={1000}
          step={1}
          prefix="R$"
        />

        <SliderBlock
          label="Reviews mínimo"
          value={form.reviews}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, reviews: value }))
          }
          min={0}
          max={100000}
          step={1}
        />
      </div>

      <Button
        onClick={handleSubmit}
        className="
          w-full 
          bg-white 
          text-black 
          font-semibold 
          hover:bg-neutral-200 
          transition
        "
      >
        Gerar Playlist
      </Button>
    </div>
  );
}