import { Card, CardHeader, CardTitle } from "./ui/card";
import type { GameTeste } from "../models/Game";

type Props = {
  games: GameTeste[]
  title?: string
}

export function PlaylistCard({ games, title }: Props) {
  return (
    <Card className="relative overflow-hidden pt-0 group">
      <div className="absolute inset-0 z-10 bg-black/30" />
      
      <div className="grid grid-cols-2 grid-rows-2 h-40 w-full">
        {games.slice(0, 4).map((game, i) => (
          <img
            key={i}
            src={game.url_image}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ))}
      </div>

      <CardHeader className="relative z-20">
        <CardTitle className="text-sm">
          {title ?? "Playlist"}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}