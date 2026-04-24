"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

export function PlaylistCreateForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    rating: [50, 100],
    price: [0, 300],
    reviews: [0, 100000],
  });

  async function handleSubmit() {
    const payload = {
      title: form.title,
      description: form.description,
      tags: form.tags,
      min_rating: form.rating[0],
      max_rating: form.rating[1],
      min_value: form.price[0],
      max_value: form.price[1],
      min_review: form.reviews[0],
      max_review: form.reviews[1],
    };

    try {
      await fetch("http://localhost:8000/api/playlist/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
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
            setForm({ ...form, title: e.target.value })
          }
        />

        <Input
          placeholder="Descrição"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      {/* FILTROS */}
      <div className="space-y-5">
        <h3 className="text-sm font-medium">Filtros</h3>

        <Input
          placeholder="Tag (RPG, FPS...)"
          value={form.tags}
          onChange={(e) =>
            setForm({ ...form, tags: e.target.value })
          }
        />

        {/* RATING */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Rating</Label>
            <span className="text-sm text-muted-foreground">
              {form.rating[0]}% - {form.rating[1]}%
            </span>
          </div>

          <Slider
            value={form.rating}
            onValueChange={(value) =>
              setForm({ ...form, rating: value })
            }
            min={0}
            max={100}
            step={1}
          />
        </div>

        {/* PREÇO */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Preço</Label>
            <span className="text-sm text-muted-foreground">
              R$ {form.price[0]} - R$ {form.price[1]}
            </span>
          </div>

          <Slider
            value={form.price}
            onValueChange={(value) =>
              setForm({ ...form, price: value })
            }
            min={0}
            max={300}
            step={5}
          />
        </div>

        {/* REVIEWS */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Reviews</Label>
            <span className="text-sm text-muted-foreground">
              {form.reviews[0]} - {form.reviews[1]}
            </span>
          </div>

          <Slider
            value={form.reviews}
            onValueChange={(value) =>
              setForm({ ...form, reviews: value })
            }
            min={0}
            max={100000}
            step={100}
          />
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Gerar Playlist
      </Button>
    </div>
  );
}