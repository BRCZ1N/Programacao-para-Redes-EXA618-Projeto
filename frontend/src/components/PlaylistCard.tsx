"use client";

import { Checkbox } from "../components/ui/checkbox";
import type { GameTeste } from "../models/Game";

type Props = {
  games: GameTeste[];
  title?: string;
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
  onClick?: () => void;
};

export function PlaylistCard({
  games,
  title,
  selected = false,
  onSelect,
}: Props) {
  return (
    <div
      onClick={() => onSelect?.(!selected)}
      className="
        group relative w-full overflow-hidden
        bg-slate-900/40 border border-slate-800
        rounded-lg shadow-sm cursor-pointer
        transition hover:border-slate-600 hover:bg-slate-900/60
      "
    >
      {/* overlay seleção */}
      <div
        className={`absolute inset-0 z-10 transition-all ${
          selected ? "bg-blue-500/10" : "bg-transparent"
        }`}
      />

      {/* checkbox */}
      <div
        className="absolute top-2 left-2 z-20 opacity-80 group-hover:opacity-100 transition"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={selected}
          onCheckedChange={(value) => onSelect?.(value === true)}
          className="
            h-5 w-5 rounded-md
            border border-slate-500
            bg-slate-900/70
            backdrop-blur-sm
            transition
            data-[state=checked]:bg-blue-600
            data-[state=checked]:border-blue-500
            hover:scale-105
          "
        />
      </div>

      {/* imagens */}
      <div className="grid grid-cols-2 w-full h-40 overflow-hidden">
        {games.slice(0, 4).map((game, index) => (
          <img
            key={index}
            src={game.url_image}
            alt={title ?? "playlist"}
            className="w-full h-full object-cover"
          />
        ))}
      </div>

      {/* footer */}
      <div className="p-3 relative z-20">
        <p className="text-sm font-medium text-slate-200">
          {title ?? "Playlist"}
        </p>

        <p className="text-xs text-slate-500">
          {games.length} jogos
        </p>
      </div>
    </div>
  );
}