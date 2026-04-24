import { Dialog, DialogContent, DialogHeader } from "../components/ui/dialog";

import { PlaylistCreateForm } from "./PlaylistCreateForm";

export function DialogCreatePlaylist({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pr-10">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
              <PlaylistCreateForm/>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
