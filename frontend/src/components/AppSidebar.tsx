"use client";

import { Search, Plus, Library } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";

import type { Playlist } from "../models/Playlist";
import { DialogCreatePlaylist } from "../components/DialogCreatePlaylist";
import { useMediaQuery } from "../hooks/HookSearch";

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

  // 🌐 Nova URL do Render configurada aqui:
  const [nextUrl, setNextUrl] = useState<string | null>(
    "https://programacao-para-redes-exa618-projeto.onrender.com/api/playlist/"
  );

  const isFetchingRef = useRef(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const isCompact = useMediaQuery("(max-width: 700px)");

  const resetAndReload = useCallback(() => {
    setPlaylists([]);
    setNextUrl(
      "https://programacao-para-redes-exa618-projeto.onrender.com/api/playlist/"
    );
  }, []);

  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const filteredPlaylists = useMemo(() => {
    const query = normalize(search);
    if (!query) return playlists;

    return playlists.filter((p) =>
      normalize(p.title).startsWith(query)
    );
  }, [playlists, search]);

  const loadPlaylists = useCallback(async () => {
    if (!nextUrl || isFetchingRef.current) return;

    isFetchingRef.current = true;

    try {
      const res = await fetch(nextUrl, {
        credentials: "include",
      });

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

  const handleCreated = () => {
    resetAndReload();
  };

  return (
    <>
      <aside
        style={{
          height: "100%",
          width: isCompact ? "70px" : "280px", 
          minWidth: isCompact ? "70px" : "280px",
          display: "flex",
          flexDirection: "column",
          background: theme.bg,
          color: theme.text,
          borderRight: `1px solid ${theme.border}`,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            padding: 12,
            display: "flex",
            justifyContent: isCompact ? "center" : "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setOpenCreateDialog(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              fontSize: 12,
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
              background: theme.surface,
              color: theme.text,
              cursor: "pointer",
            }}
          >
            <Plus size={14} />
            {!isCompact && "Criar"}
          </button>
        </div>

        {!isCompact && (
          <div
            style={{
              padding: "0 12px 12px",
              display: "flex",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: theme.surface,
                padding: "8px 10px",
                borderRadius: 8,
                border: `1px solid ${theme.border}`,
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <Search size={14} color={theme.muted} style={{ flexShrink: 0 }} />

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
                  minWidth: 0,
                }}
              />
            </div>
          </div>
        )}

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 6,
          }}
        >
          {filteredPlaylists.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/dashboard/playlist/${item.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 10,
                borderRadius: 8,
                cursor: "pointer",
                transition: "background 0.15s ease",
                minWidth: 0,
              }}
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
                {item.games?.[0]?.url_image ? (
                  <img
                    src={item.games[0].url_image}
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

              {!isCompact && (
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
              )}
            </div>
          ))}
        </div>
      </aside>

      <DialogCreatePlaylist
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onCreated={handleCreated}
      />
    </>
  );
}