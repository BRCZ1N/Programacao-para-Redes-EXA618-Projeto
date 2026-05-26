"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Playlist } from "../models/Playlist";
import { DialogCreatePlaylist } from "../components/DialogCreatePlaylist";
import { DialogEditPlaylist } from "../components/DialogEditPlaylist";
import { DialogDeletePlaylist } from "../components/DialogDeletePlaylist";
import { Search, Library, MoreHorizontal } from "lucide-react";

const theme = {
  bg: "#000000",
  surface: "#121212",
  surface2: "#1A1A1A",
  border: "#2A2A2A",
  text: "#FFFFFF",
  muted: "#B3B3B3",
  accent: "#1DB954",
};


const buttonBase = {
  padding: "8px 14px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 700,
  border: "1px solid rgba(255,255,255,0.08)",
  cursor: "pointer",
  transition: "0.2s ease",
  whiteSpace: "nowrap" as const, 
};

const buttonVariants = {
  remove: {
    background: "#E50914",
    color: "#fff",
    border: "none",
  },
  add: {
    background: "#1DB954",
    color: "#000",
    border: "none",
  },
  disabled: {
    background: "#2A2A2A",
    color: "#A1A1A1",
    cursor: "not-allowed",
  },
};

const buttonStyle = (variant: keyof typeof buttonVariants) => ({
  ...buttonBase,
  ...buttonVariants[variant],
});

export function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [search, setSearch] = useState("");
  const [games, setGames] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const playlistGames = useMemo(
    () => activePlaylist?.games || [],
    [activePlaylist],
  );

  const playlistGameIds = useMemo(
    () => new Set(playlistGames.map((g) => g.id)),
    [playlistGames],
  );

  const fetchPlaylist = async () => {
    if (!id) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/playlist/${id}/`, {
        credentials: "include",
      });
      const json = await res.json();
      setActivePlaylist(json);
    } catch (err) {
      console.error("Erro no fetch playlist:", err);
    }
  };

  useEffect(() => {
    fetchPlaylist();
    setShowDropdown(false);
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
          `http://127.0.0.1:8000/api/games/search/?title=${encodeURIComponent(
            search,
          )}`,
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

  const handleDeleteConfirm = async () => {
    if (!activePlaylist) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/playlist/${activePlaylist.id}/`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) return;

      navigate("/dashboard");
      window.location.reload();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleCreated = (playlist: Playlist) => {
    setActivePlaylist(playlist);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: theme.bg,
        color: theme.text,
        overflowX: "hidden", 
      }}
    >
      <div
        style={{
          padding: "clamp(16px, 4%, 32px)",
          display: "flex",
          gap: "24px",
          flexFlow: "row wrap", 
          alignItems: "center",
          background: "linear-gradient(to bottom, #1A1A1A, #000000)",
          borderBottom: `1px solid ${theme.border}`,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "clamp(100px, 28vw, 160px)",
            height: "clamp(100px, 28vw, 160px)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            overflow: "hidden",
            borderRadius: 12,
            background: theme.surface,
            flexShrink: 0, 
          }}
        >
          {playlistGames.length > 0 ? (
            playlistGames.slice(0, 4).map((g, i) => (
              <div key={i} style={{ width: "100%", height: "100%" }}>
                {g.url_image ? (
                  <img
                    src={g.url_image}
                    alt={g.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Library size={16} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Library size={24} />
            </div>
          )}
        </div>

        <div style={{ flex: "1 1 280px", minWidth: 0, position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(20px, 4.5vw, 36px)",
                fontWeight: 800,
                margin: 0,
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                flex: 1,
              }}
            >
              {activePlaylist?.title ?? "Carregando playlist..."}
            </h1>

            {activePlaylist && (
              <div style={{ position: "relative", flexShrink: 0 }}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: theme.muted,
                    cursor: "pointer",
                    padding: 8,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <MoreHorizontal size={22} />
                </button>

                {showDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0, 
                      marginTop: 6,
                      background: "#121212",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                      zIndex: 50,
                      width: 140,
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => {
                        setOpenEdit(true);
                        setShowDropdown(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#1A1A1A")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setOpenDelete(true);
                        setShowDropdown(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "transparent",
                        border: "none",
                        color: "#ff4d4d",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#1A1A1A")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <p
            style={{
              margin: "8px 0 12px",
              color: theme.muted,
              fontSize: "clamp(13px, 2vw, 15px)",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {activePlaylist?.description || "Sem descrição"}
          </p>

          <div style={{ fontSize: 13, color: theme.muted, fontWeight: 500 }}>
            {playlistGames.length}{" "}
            {playlistGames.length === 1 ? "jogo" : "jogos"}
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 32,
          padding: "clamp(12px, 4%, 24px)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <section style={{ width: "100%" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
            Jogos da Playlist
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%",
            }}
          >
            {playlistGames.map((game) => (
              <div
                key={game.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "12px",
                  borderRadius: 12,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  {game.url_image ? (
                    <img
                      src={game.url_image}
                      alt={game.title}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: theme.surface2,
                        flexShrink: 0,
                      }}
                    >
                      <Library size={16} />
                    </div>
                  )}

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#fff",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {game.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: theme.muted,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {game.developer?.[0] || "Desenvolvedora desconhecida"}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleGame(game)}
                  style={buttonStyle("remove")}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </section>

        <section style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              background: theme.surface2,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <Search size={18} color={theme.muted} style={{ flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar jogos para adicionar..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: theme.text,
                fontSize: 14,
                width: "100%",
              }}
            />
          </div>
        </section>

        <section style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%",
            }}
          >
            {games.map((game) => {
              const isAdded = playlistGameIds.has(game.id);

              return (
                <div
                  key={game.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "12px",
                    borderRadius: 12,
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    opacity: isAdded ? 0.6 : 1,
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    {game.url_image ? (
                      <img
                        src={game.url_image}
                        alt={game.title}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: theme.surface2,
                          flexShrink: 0,
                        }}
                      >
                        <Library size={16} />
                      </div>
                    )}

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#fff",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {game.title}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleGame(game)}
                    disabled={isAdded}
                    style={buttonStyle(isAdded ? "disabled" : "add")}
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

      <DialogEditPlaylist
        open={openEdit}
        onOpenChange={setOpenEdit}
        playlist={activePlaylist}
        onUpdated={fetchPlaylist}
      />

      <DialogDeletePlaylist
        open={openDelete}
        onOpenChange={setOpenDelete}
        playlistTitle={activePlaylist?.title || ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
