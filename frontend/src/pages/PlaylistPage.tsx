"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
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
  const { id } = useParams();

  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);

  const [search, setSearch] = useState("");
  const [games, setGames] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const playlistGames = useMemo(
    () => activePlaylist?.games || [],
    [activePlaylist],
  );

  const playlistGameIds = useMemo(
    () => new Set(playlistGames.map((g) => g.id)),
    [playlistGames],
  );

  useEffect(() => {
    if (!id) return;

    const fetchPlaylist = async () => {
      try {
        const res = await fetch(`https://programacao-para-redes-exa618-projeto.onrender.com/api/playlist/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Erro ao buscar playlist:", res.status);
          return;
        }

        const json = await res.json();

        setActivePlaylist(json);
      } catch (err) {
        console.error("Erro no fetch:", err);
      }
    };

    fetchPlaylist();
  }, [id]);

  useEffect(() => {
    const fetchGames = async () => {
      if (!search.trim()) {
        setGames([]);
        return;
      }

      setIsSearching(true);

      try {
        const res = await fetch(
          `https://programacao-para-redes-exa618-projeto.onrender.com/api/games/search/?title=${encodeURIComponent(search)}`,
          { credentials: "include" },
        );

        const json = await res.json();
        setGames(Array.isArray(json) ? json : json.results || []);
      } catch (err) {
        console.error("Erro games:", err);
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

    const res = await fetch(
      `https://programacao-para-redes-exa618-projeto.onrender.com/api/playlist/${activePlaylist.id}/`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: alreadyAdded ? "remove" : "add",
          game_ids: [game.id],
        }),
      },
    );

    const updated = await res.json();

    setActivePlaylist(updated);
  };

  const handleCreated = (playlist: Playlist) => {
    setActivePlaylist(playlist);
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
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
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
            {activePlaylist?.title ?? "Carregando playlist..."}
          </h1>

          <span style={{ color: theme.muted, fontSize: 13 }}>
            {playlistGames.length} jogos
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          Jogos da Playlist
        </h2>

        <div style={{ display: "flex-1", flexDirection: "column", gap: 8 }}>
          {playlistGames.map((game) => (
            <div
              key={game.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 8,
                borderRadius: 8,
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
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "none",
                  background: "#E50914",
                  color: "#fff",
                  fontSize: 12,
                  cursor: "pointer", 
                  transition: "0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#b20710";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#E50914";
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
            padding: "8px 10px",
            background: "#1A1A1A",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
          }}
        >
          <Search size={16} color={theme.muted} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar jogos..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: theme.text,
              fontSize: 13,
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
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: isAdded ? "#2A2A2A" : theme.accent,
                    color: isAdded ? "#A1A1A1" : "#000",
                    fontSize: 12,
                    cursor: isAdded ? "not-allowed" : "pointer",
                    opacity: isAdded ? 0.7 : 1,
                    transition: "0.2s",
                  }}
                >
                  {isAdded ? "Adicionado" : "Adicionar"}
                </button>
              </div>
            );
          })}
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
