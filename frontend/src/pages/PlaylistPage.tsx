"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import type { Playlist } from "../models/Playlist";
import { DialogCreatePlaylist } from "../components/DialogPlaylistCreate";
import { Search } from "lucide-react";

const theme = {
  bg: "#000000",
  surface: "#121212",
  surface2: "#1A1A1A",
  border: "#2A2A2A",
  text: "#FFFFFF",
  muted: "#B3B3B3",
  accent: "#1DB954",
};

export function PlaylistPage() {
  const [data, setData] = useState<Playlist[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);

  const [search, setSearch] = useState("");
  const [games, setGames] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [playlistGames, setPlaylistGames] = useState<any[]>([]);
  const [openCreate, setOpenCreate] = useState(false);

  const playlistGameIds = useMemo(
    () => new Set(playlistGames.map((g) => g.id)),
    [playlistGames],
  );

  const loadMore = useCallback(async () => {
    const res = await fetch("http://localhost:8000/api/playlist/", {
      credentials: "include",
    });

    const json = await res.json();
    setData(json.results || []);

    if (!activePlaylist && json.results?.length > 0) {
      setActivePlaylist(json.results[0]);
      setPlaylistGames(json.results[0].games || []);
    }
  }, [activePlaylist]);

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      if (!search.trim()) {
        setGames([]);
        return;
      }

      setIsSearching(true);

      try {
        const res = await fetch(
          `http://localhost:8000/api/games/?search=${search}`,
          { credentials: "include" },
        );

        const json = await res.json();
        setGames(json.results || []);
      } finally {
        setIsSearching(false);
      }
    };

    const delay = setTimeout(fetchGames, 300);
    return () => clearTimeout(delay);
  }, [search]);

  const toggleGame = async (game: any) => {
    if (!activePlaylist) return;

    const alreadyAdded = playlistGameIds.has(game.id);

    const res = await fetch("http://localhost:8000/api/playlist/", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlist_id: activePlaylist.id,
        action: alreadyAdded ? "remove" : "add",
        game_ids: [game.id],
      }),
    });

    const updated = await res.json();

    setPlaylistGames(updated.games);
    setActivePlaylist(updated);
  };

  const handleCreated = (playlist: Playlist) => {
    setData((prev) => [playlist, ...prev]);
    setActivePlaylist(playlist);
    setPlaylistGames(playlist.games || []);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: theme.bg,
        color: theme.text,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: "16px",
          display: "flex",
          gap: 16,
          background: "linear-gradient(to bottom, #1A1A1A, #000000)",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            overflow: "hidden",
            borderRadius: 12,
            background: theme.surface,
          }}
        >
          {playlistGames.slice(0, 4).map((g, i) => (
            <img
              key={i}
              src={g.url_image}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ))}
        </div>

        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {activePlaylist?.title || "Nenhuma playlist"}
          </h1>

          <span style={{ color: theme.muted, fontSize: 13 }}>
            {playlistGames.length} jogos
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 16, overflow: "auto" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Jogos da Playlist
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {playlistGames.map((game) => (
              <div
                key={game.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 8,
                  borderRadius: 8,
                  background: "transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = theme.surface)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <img
                  src={game.url_image}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 6,
                    objectFit: "cover",
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {game.title}
                  </div>
                  <div style={{ fontSize: 12, color: theme.muted }}>
                    {game.developer?.[0]}
                  </div>
                </div>

                <button
                  onClick={() => toggleGame(game)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "none",
                    background: "#E50914",
                    color: "#fff",
                    fontSize: 12,
                  }}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: 16,
            borderTop: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              background: "#000",
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
            }}
          >
            <Search size={16} color={theme.muted} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar jogos..."
              style={{
                flex: 1,
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.08)",
                outline: "none",
                color: theme.text,
                fontSize: 13,
                padding: "8px 10px",
                borderRadius: 8,
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          {isSearching && (
            <div style={{ color: theme.muted, textAlign: "center" }}>
              Buscando jogos...
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {games.map((game) => {
              const isAdded = playlistGameIds.has(game.id);

              return (
                <div
                  key={game.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 8,
                    borderRadius: 8,
                    opacity: isAdded ? 0.4 : 1,
                  }}
                >
                  <img
                    src={game.url_image}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 6,
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14 }}>{game.title}</div>
                    <div style={{ fontSize: 12, color: theme.muted }}>
                      {game.developer?.[0]}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleGame(game)}
                    disabled={isAdded}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: "none",
                      background: isAdded ? "#333" : theme.accent,
                      color: "#000",
                      fontSize: 12,
                    }}
                  >
                    {isAdded ? "Adicionado" : "Adicionar"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <DialogCreatePlaylist
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreated={handleCreated}
      />
    </div>
  );
}
