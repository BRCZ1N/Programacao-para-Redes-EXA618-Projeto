import { List } from "lucide-react";

import { Button } from "../components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../components/ui/empty";
import { apiFetch } from "../fetcher/Fetcher";
import type { Playlist } from "../models/Playlist";
import { useState } from "react";
import { PlaylistDrawer } from "./PlaylistDrawer";

export function EmptyDemo() {
  const [playlist, setPlaylist] = useState<Playlist>();
  const [open, setOpen] = useState(false);

  async function handleGeneratePlaylist() {
    try {
      const response = await apiFetch("http://localhost:8000/api/playlist/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "auto",
        }),
      });
      if (!response.ok) return;

      const data = await response.json();

      setPlaylist(data);
      setOpen(true);
    } catch (error) {
      console.log("Erro na requisição:", error);
    }
  }

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <List />
        </EmptyMedia>

        <EmptyTitle>Sua biblioteca está vazia</EmptyTitle>

        <EmptyDescription>
          Crie sua primeira playlist e organize seus jogos favoritos em um só
          lugar.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button onClick={handleGeneratePlaylist}>Criar playlist</Button>
      </EmptyContent>
      <PlaylistDrawer
        open={open}
        onOpenChange={setOpen}
        playlist={playlist}
        onGenerateAgain={handleGeneratePlaylist}
      />
    </Empty>
  );
}
