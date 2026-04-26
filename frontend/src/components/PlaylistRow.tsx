"use client";

import { useNavigate } from "react-router-dom";
import type { Playlist } from "../models/Playlist";

type Props = {
  playlist: Playlist;
  selected?: boolean;
  onSelect?: () => void;
};

export function PlaylistRow({
  playlist,
  selected,
  onSelect,
}: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/dashboard/playlist/${playlist.id}`)}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg
        cursor-pointer transition group
        hover:bg-slate-800
        ${selected ? "bg-slate-800" : ""}
      `}
    >
      <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-slate-900">
        {playlist.games?.[0]?.url_image && (
          <img
            src={playlist.games[0].url_image}
            className="w-full h-full object-cover"
          />
        )}

        <span className="
          absolute bottom-0 right-0 text-[10px]
          bg-black/70 text-white px-1 rounded
        ">
          {playlist.games?.length ?? 0}
        </span>
      </div>


      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-sm text-white truncate">
          {playlist.title}
        </span>

        <span className="text-xs text-slate-400 truncate">
          {playlist.description}
        </span>
      </div>

      <div
        className="
          flex items-center gap-2
          opacity-0 group-hover:opacity-100
          transition
        "
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="accent-blue-500"
        />
      </div>
    </div>
  );
}