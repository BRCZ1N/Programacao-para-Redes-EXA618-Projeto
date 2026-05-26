"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

import { PlaylistCreateForm } from "./PlaylistCreateForm";

import { Plus, Sparkles, ArrowLeft } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (playlist: any) => void;
};

export function DialogCreatePlaylist({
  open,
  onOpenChange,
  onCreated,
}: Props) {
  const [mode, setMode] = useState<"select" | "filters">("select");
  const [loading, setLoading] = useState(false);

  function handleClose(open: boolean) {
    onOpenChange(open);

    if (!open) {
      setTimeout(() => {
        setMode("select");
      }, 150);
    }
  }

  async function handleCreateEmpty() {
    try {
      setLoading(true);

      const res = await fetch("https://programacao-para-redes-exa618-projeto.onrender.comapi/playlist/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "empty",
        }),
      });

      const playlist = await res.json();

      onCreated?.(playlist);
      onOpenChange(false);
    } catch (err) {
      console.error("Erro ao criar playlist vazia:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="
          sm:max-w-xl
          bg-black
          border border-zinc-800
          text-white
          shadow-xl shadow-black/40
          overflow-hidden
          p-0
        "
      >
        {mode === "select" ? (
          <>
            <DialogHeader className="space-y-1 border-b border-zinc-800 px-6 py-5">
              <DialogTitle className="text-lg font-semibold text-white">
                Criar playlist
              </DialogTitle>

              <DialogDescription className="text-sm text-zinc-400">
                Escolha como deseja criar sua playlist.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 p-4">
         
              <button
                onClick={handleCreateEmpty}
                disabled={loading}
                className="
                  w-full rounded-2xl border border-zinc-800 bg-zinc-950
                  p-4 text-left transition-all
                  hover:bg-zinc-900 hover:border-zinc-700
                  disabled:opacity-50
                  cursor-pointer
                "
              >
                <div className="flex items-start gap-4">
                  <div
                    className="
                      flex h-11 w-11 items-center justify-center
                      rounded-xl border border-white/5 bg-white/5
                    "
                  >
                    <Plus size={18} />
                  </div>

                  <div className="min-w-0">
                    <div className="font-medium text-white">
                      Playlist vazia
                    </div>

                    <div className="mt-1 text-sm text-zinc-400">
                      Monte manualmente sua playlist adicionando jogos.
                    </div>
                  </div>
                </div>
              </button>

            
              <button
                onClick={() => setMode("filters")}
                className="
                  w-full rounded-2xl border border-zinc-800 bg-zinc-950
                  p-4 text-left transition-all
                  hover:bg-zinc-900 hover:border-zinc-700
                  cursor-pointer
                "
              >
                <div className="flex items-start gap-4">
                  <div
                    className="
                      flex h-11 w-11 items-center justify-center
                      rounded-xl border border-white/5 bg-white/5
                    "
                  >
                    <Sparkles size={18} />
                  </div>

                  <div className="min-w-0">
                    <div className="font-medium text-white">
                      Baseada em filtros
                    </div>

                    <div className="mt-1 text-sm text-zinc-400">
                      Gere playlists automaticamente com base em
                      gênero, nota, preço e reviews.
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-zinc-800 px-6 py-4">
              <button
                onClick={() => setMode("select")}
                className="
                  mb-4 flex items-center gap-2 text-sm text-zinc-400
                  transition hover:text-white cursor-pointer
                "
              >
                <ArrowLeft size={16} />
                Voltar
              </button>

              <DialogTitle className="text-lg font-semibold">
                Playlist baseada em filtros
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm text-zinc-400">
                Configure os parâmetros da sua playlist.
              </DialogDescription>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-4">
              <PlaylistCreateForm
                onSuccess={(playlist) => {
                  onCreated?.(playlist);
                  onOpenChange(false);
                  setMode("select");
                }}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}