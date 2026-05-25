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
        const res = await fetch(
          `http://127.0.0.1:8000/api/playlist/${id}/`,
          {
            credentials: "include",
          },
        );

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
      setIsSearching(true);

      try {
        if (!search.trim()) {
          const res = await fetch(
            `http://127.0.0.1:8000/api/games/featured/?type=new`,
            { credentials: "include" },
          );

          const json = await res.json();
          setGames(Array.isArray(json) ? json : json.results || []);
          return;
        }

        const res = await fetch(
          `http://127.0.0.1:8000/api/games/search/?title=${encodeURIComponent(search)}`,
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
      `http://127.0.0.1:8000/api/playlist/${activePlaylist.id}/`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: theme.bg,
        color: theme.text,
      }}
    >
     
      <div
        style={{
          padding: "clamp(12px, 3vw, 24px)",
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center",
          background: "linear-gradient(to bottom, #1A1A1A, #000000)",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            width: "clamp(90px, 25vw, 140px)",
            height: "clamp(90px, 25vw, 140px)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            overflow: "hidden",
            borderRadius: 12,
            background: theme.surface,
            flexShrink: 0,
          }}
        >
          {playlistGames.slice(0, 4).map((g, i) => (
            <img
              key={i}
              src={g.url_image}
              alt={g.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ))}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            style={{
              fontSize: "clamp(22px, 5vw, 38px)",
              fontWeight: 800,
              lineHeight: 1.1,
              margin: 0,
              wordBreak: "break-word",
            }}
          >
            {activePlaylist?.title ?? "Carregando playlist..."}
          </h1>

          <p
            style={{
              margin: "6px 0 10px 0",
              fontSize: "clamp(12px, 2.2vw, 15px)",
              lineHeight: 1.4,
              color: theme.muted,
              maxWidth: "90%",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "normal",
              opacity: 0.9,
            }}
          >
            {activePlaylist?.description ||
              "Sem descrição"}
          </p>

          <span
            style={{
              color: theme.muted,
              fontSize: "clamp(12px, 2vw, 14px)",
            }}
          >
            {playlistGames.length} jogos
          </span>
        </div>
      </div>

   
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: "clamp(12px, 3vw, 20px)",
        }}
      >
        <section>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
            Jogos da Playlist
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {playlistGames.map((game) => (
              <div
                key={game.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 10,
                  borderRadius: 10,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  flexWrap: "wrap",
                }}
              >
                <img
                  src={game.url_image}
                  alt={game.title}
                  style={{
                    width: "clamp(42px, 10vw, 52px)",
                    height: "clamp(42px, 10vw, 52px)",
                    borderRadius: 8,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {game.title}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: theme.muted,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {game.developer?.[0]}
                  </div>
                </div>

                <button
                  onClick={() => toggleGame(game)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "#E50914",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    minWidth: 90,
                  }}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </section>


        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              background: theme.surface2,
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              width: "100%",
              boxSizing: "border-box",
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
                fontSize: 14,
                minWidth: 0,
              }}
            />
          </div>
        </section>
        
        <section>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {games.map((game) => {
              const isAdded = playlistGameIds.has(game.id);

              return (
                <div
                  key={game.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 10,
                    borderRadius: 10,
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    opacity: isAdded ? 0.5 : 1,
                    flexWrap: "wrap",
                  }}
                >
                  <img
                    src={game.url_image}
                    alt={game.title}
                    style={{
                      width: "clamp(42px, 10vw, 52px)",
                      height: "clamp(42px, 10vw, 52px)",
                      borderRadius: 8,
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {game.title}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: theme.muted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {game.developer?.[0]}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleGame(game)}
                    disabled={isAdded}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: isAdded ? "#2A2A2A" : theme.accent,
                      color: isAdded ? "#A1A1A1" : "#000",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: isAdded ? "not-allowed" : "pointer",
                      minWidth: 100,
                    }}
                  >
                    {isAdded ? "Adicionado" : "Adicionar"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <DialogCreatePlaylist
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreated={handleCreated}
      />
    </div>
  );
}