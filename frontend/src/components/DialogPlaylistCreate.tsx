import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

import { PlaylistCreateForm } from "./PlaylistCreateForm";

export function DialogCreatePlaylist({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (playlist: any) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-2xl
          max-h-[90vh]
          flex flex-col
          bg-slate-950
          border border-slate-800/60
          text-white
          shadow-xl shadow-black/40
        "
      >
        <DialogHeader className="space-y-1 border-b border-slate-800/60 pb-4">
          <DialogTitle className="text-lg font-semibold text-white">
            Criar nova playlist
          </DialogTitle>

          <DialogDescription className="text-sm text-slate-400">
            Organize seus jogos criando uma nova playlist personalizada.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <PlaylistCreateForm
            onSuccess={(playlist) => {
              onCreated(playlist);
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}