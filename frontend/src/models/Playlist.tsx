import type { Game } from "../models/Game";

export type Playlist = {
  id: string;
  title: string;
  updated_at: string;
  description: string;
  games: Game[];
};


