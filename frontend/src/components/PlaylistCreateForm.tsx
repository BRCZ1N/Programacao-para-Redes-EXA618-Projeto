"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SliderBlock } from "./SliderBlock";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type Props = {
  onSuccess?: (playlist: any) => void;
};

type Tag = {

  name: string

}

const theme = {
  bg: "#000000",
  card: "#0F0F0F",
  border: "#262626",
  text: "#FFFFFF",
  muted: "#A3A3A3",
  accent: "#FFFFFF",
};

export function PlaylistCreateForm({ onSuccess }: Props) {

  const[tags, setTags] = useState<Tag[]>([]);
  const[selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: selectedTags,
    rating: [5],
    price: [0],
    reviews: [0],
  });


  async function fetchTags() {

    try {
      const res = await fetch("https://programacao-para-redes-exa618-projeto.onrender.com/api/games/tag/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao buscar as tags");

      setTags(await res.json())

    } catch (err) {
      console.log("Erro:", err);
    }
  }

  async function handleSubmit() {
    const payload = {
      mode: "custom",
      title: form.title,
      description: form.description,
      tag: form.tags,
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
        tags: [],
        rating: [5],
        price: [0],
        reviews: [0],
      });
    } catch (err) {
      console.log("Erro:", err);
    }
  }

   useEffect(() => {
    fetchTags();
  }, []);

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

        <Autocomplete
            multiple
            limitTags={2}
            id="multiple-limit-tags"
            options={tags}
            value={selectedTags}
            onChange={(_, value) => {
              setSelectedTags(value);
            }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              fullWidth
            />
             )}
            sx={{
                  width: "100%",
            }}
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
          cursor-pointer
        "
      >
        Gerar Playlist
      </Button>
    </div>
  );
}