"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistTitle: string;
  onConfirm: () => Promise<void>;
};

export function DialogDeletePlaylist({
  open,
  onOpenChange,
  playlistTitle,
  onConfirm,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange(false);
    } catch (err) {
      console.error("Erro ao excluir playlist:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-md
          bg-black
          border border-zinc-800
          text-white
          shadow-xl shadow-black/40
          overflow-hidden
          p-0
        "
      >
        <DialogHeader className="space-y-1 border-b border-zinc-800 px-6 py-5">
          <DialogTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Trash2 size={18} className="text-red-500" />
            Excluir playlist
          </DialogTitle>

          <DialogDescription className="text-sm text-zinc-400">
            Esta ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <p className="text-sm text-zinc-300">
            Tem certeza que deseja excluir a playlist{" "}
            <span className="font-semibold text-white">"{playlistTitle}"</span>? Todos os jogos salvos nela serão removidos da lista.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 bg-zinc-950/50 px-6 py-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="
              px-4 py-2 rounded-xl text-sm font-medium border border-zinc-800 bg-transparent
              text-zinc-400 transition hover:text-white hover:bg-zinc-900 disabled:opacity-50
              cursor-pointer
            "
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="
              px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white
              transition hover:bg-red-700 disabled:opacity-50 cursor-pointer
            "
          >
            {loading ? "Excluindo..." : "Excluir permanentemente"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}