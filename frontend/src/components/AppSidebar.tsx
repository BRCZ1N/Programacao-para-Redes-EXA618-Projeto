"use client";

import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import type { Playlist } from "../models/Playlist";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "../components/ui/context-menu";

import { DialogEditPlaylist } from "../components/DialogEditPlaylist";

const theme = {
  bg: "#000000",
  surface: "#121212",
  surfaceHover: "#1A1A1A",
  border: "#2A2A2A",
  text: "#FFFFFF",
  muted: "#B3B3B3",
  accent: "#1DB954",
};

export function AppSidebar() {
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [search, setSearch] = useState("");

  const [nextUrl, setNextUrl] = useState<string | null>(
    "http://programacao-para-redes-exa618-projeto.onrender.com/api/playlist/",
  );

  const isFetchingRef = useRef(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null,
  );

  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const filteredPlaylists = playlists
    .map((p) => {
      const title = normalize(p.title);
      const query = normalize(search);

      if (!query) return { playlist: p, score: 1 };

      let score = 0;
      if (title.startsWith(query)) score += 100;
      if (title.includes(query)) score += 50;

      return { playlist: p, score };
    })
    .filter((i) => i.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((i) => i.playlist);

  const loadPlaylists = useCallback(async () => {
    if (!nextUrl || isFetchingRef.current) return;

    isFetchingRef.current = true;

    try {
      const res = await fetch(nextUrl, { credentials: "include" });
      const json = await res.json();

      setPlaylists((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const newItems = json.results.filter((p: Playlist) => !ids.has(p.id));
        return [...prev, ...newItems];
      });

      setNextUrl(json.next);
    } finally {
      isFetchingRef.current = false;
    }
  }, [nextUrl]);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  const createPlaylist = async () => {
    const res = await fetch("http://programacao-para-redes-exa618-projeto.onrender.com/api/playlist/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Nova playlist ${playlists.length + 1}`,
        description: "",
      }),
    });

    const json = await res.json();
    setPlaylists((prev) => [json, ...prev]);
    navigate(`/dashboard/playlist/${json.id}`);
  };

  const deletePlaylist = async (id: string) => {
    try {
      const res = await fetch(`http://programacao-para-redes-exa618-projeto.onrender.com/api/playlist/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) return;

      setPlaylists((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const editPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setOpenEdit(true);
  };

  const handleUpdated = (updated: Playlist) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p)),
    );
  };

  return (
    <>
      <aside
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: theme.bg,
          color: theme.text,
          borderRight: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            padding: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={createPlaylist}
            className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border border-[#2A2A2A] text-white hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <Plus size={14} />
            Criar
          </button>
        </div>

        <div style={{ padding: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: theme.surface,
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
            }}
          >
            <Search size={16} color={theme.muted} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar playlist..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: theme.text,
                width: "100%",
                fontSize: 13,
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
          {filteredPlaylists.map((item) => (
            <ContextMenu key={item.id}>
              <ContextMenuTrigger asChild>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/dashboard/playlist/${item.id}`)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = theme.surfaceHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      overflow: "hidden",
                      background: theme.surface,
                      flexShrink: 0,
                    }}
                  >
                    {item.games?.[0]?.url_image && (
                      <img
                        src={item.games[0].url_image}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </span>
                </div>
              </ContextMenuTrigger>

              <ContextMenuContent
                style={{
                  background: "#121212",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fff",
                  width: 160,
                }}
              >
                <ContextMenuItem onClick={() => editPlaylist(item)}>
                  Editar
                </ContextMenuItem>

                <ContextMenuItem
                  onClick={() => deletePlaylist(item.id)}
                  style={{ color: "#ff4d4d" }}
                >
                  Excluir
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </aside>

      <DialogEditPlaylist
        open={openEdit}
        onOpenChange={setOpenEdit}
        playlist={selectedPlaylist}
        onUpdated={handleUpdated}
      />
    </>
  );
}
