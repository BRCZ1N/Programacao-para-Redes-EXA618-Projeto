"use client";

import { Search, Plus, Library } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import type { Playlist } from "../models/Playlist";
import { DialogCreatePlaylist } from "../components/DialogCreatePlaylist";
import { useMediaQuery } from "../hooks/HookSearch";

const API_URL =
  "https://programacao-para-redes-exa618-projeto.onrender.com/api/playlist/";

const theme = {
  bg: "#000000",
  surface: "#121212",
  surfaceHover: "#1A1A1A",
  border: "#2A2A2A",
  text: "#FFFFFF",
  muted: "#B3B3B3",
};

export function AppSidebar() {
  const navigate = useNavigate();
  const isCompact = useMediaQuery("(max-width: 700px)");

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [search, setSearch] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchPlaylists() {
      try {
        const url = new URL(API_URL);

        if (search.trim()) {
          url.searchParams.append("search", search.trim());
        }

        const res = await fetch(url.toString(), {
          credentials: "include",
        });

        const json = await res.json();

        if (isMounted) {
          setPlaylists(json.results || []);
        }
      } catch (err) {
        console.error("Erro ao buscar playlists:", err);
      }
    }

    fetchPlaylists();

    return () => {
      isMounted = false;
    };
  }, [search, reloadTrigger]);

  const handlePlaylistCreated = () => {
    setReloadTrigger((prev) => prev + 1);
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
        {/* HEADER */}
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

        {/* SEARCH */}
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

        {/* LISTA */}
        <div style={{ flex: 1, overflowY: "auto", padding: 6 }}>
          {playlists.map((item) => (
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                  <Library size={16} />
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
        onCreated={handlePlaylistCreated}
      />
    </>
  );
}
