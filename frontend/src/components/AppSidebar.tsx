"use client";

import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import type { Playlist } from "../models/Playlist";

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
    "http://localhost:8000/api/playlist/"
  );

  const isFetchingRef = useRef(false);

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
  }, []);

  return (
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
          style={{
            color: theme.muted,
            background: "transparent",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        <button
          onClick={() => navigate("/dashboard/create")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            borderRadius: 8,
            background: "transparent",
            border: `1px solid ${theme.border}`,
            color: theme.text,
            fontSize: 12,
            cursor: "pointer",
          }}
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
          <div
            key={item.id}
            onClick={() => navigate(`/dashboard/playlist/${item.id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 8,
              cursor: "pointer",
              transition: "0.15s",
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
                color: theme.text,
              }}
            >
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}