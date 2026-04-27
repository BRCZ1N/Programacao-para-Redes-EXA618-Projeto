"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";

import { Button } from "./ui/button";
import { Field, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";

const theme = {
  bg: "#000000",
  surface: "#121212",
  border: "#2A2A2A",
  text: "#FFFFFF",
  muted: "#A1A1A1",
};

type Playlist = {
  id: string;
  title: string;
  description?: string;
};

export function DialogEditPlaylist({
  open,
  onOpenChange,
  playlist,
  onUpdated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist: Playlist | null;
  onUpdated: (playlist: Playlist) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (playlist) {
      setTitle(playlist.title || "");
      setDescription(playlist.description || "");
    }
  }, [playlist]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!playlist) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`https://programacao-para-redes-exa618-projeto.onrender.com/api/playlist/${playlist.id}/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!res.ok) {
        setError("Erro ao atualizar playlist");
        return;
      }

      const updated = await res.json();

      onUpdated(updated);
      onOpenChange(false);
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          width: "100%",
          maxWidth: 420,
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: 24,
          color: theme.text,
        }}
      >
        <DialogTitle style={{ fontSize: 18, fontWeight: 800 }}>
          Editar playlist
        </DialogTitle>

        <DialogDescription
          style={{
            fontSize: 13,
            color: theme.muted,
            marginBottom: 16,
          }}
        >
          Atualize as informações da sua playlist
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field>
            <FieldLabel className="text-xs text-white">Título</FieldLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#0B0F14] border-[#2A2A2A] text-white h-9 text-sm"
              required
            />
          </Field>

          <Field>
            <FieldLabel className="text-xs text-white">Descrição</FieldLabel>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0B0F14] border border-[#2A2A2A] text-white rounded-md p-2 text-sm h-24 resize-none"
            />
          </Field>

          {error && (
            <div className="text-xs text-red-400 border border-red-900 bg-red-950/30 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 font-bold h-9"
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
