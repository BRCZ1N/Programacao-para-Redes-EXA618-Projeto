"use client";

import { Search, Plus, Library } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";

import type { Playlist } from "../models/Playlist";
import { DialogCreatePlaylist } from "../components/DialogCreatePlaylist";
import { useMediaQuery } from "../hooks/HookSearch";

const BASE_URL =
  "https://programacao-para-redes-exa618-projeto.onrender.com/api/playlist/";

export function AppSidebar() {
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [nextUrl, setNextUrl] = useState<string | null>(BASE_URL);

  const isFetchingRef = useRef(false);
  const isCompact = useMediaQuery("(max-width: 700px)");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const resetAndReload = useCallback(() => {
    setPlaylists([]);
    setNextUrl(BASE_URL);
  }, []);

  // debounce da busca
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // carregar playlists
  const loadPlaylists = useCallback(async () => {
    if (!nextUrl || isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const url = new URL(nextUrl);
      if (debouncedSearch) {
        url.searchParams.set("title", debouncedSearch);
      }

      const res = await fetch(url.toString(), { credentials: "include" });
      const json = await res.json();

      setPlaylists((prev) => {
        if (debouncedSearch) {
          return json.results;
        }
        const ids = new Set(prev.map((p) => p.id));
        const newItems = json.results.filter((p: Playlist) => !ids.has(p.id));
        return [...prev, ...newItems];
      });

      setNextUrl(json.next);
    } finally {
      isFetchingRef.current = false;
    }
  }, [nextUrl, debouncedSearch]);

  useEffect(() => {
    setNextUrl(BASE_URL);
  }, [debouncedSearch]);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <button
            onClick={() => setOpenCreateDialog(true)}
            className="btn-create"
          >
            <Plus size={14} />
            {!isCompact && "Criar"}
          </button>
        </div>

        {!isCompact && (
          <div className="sidebar-search">
            <div className="search-box">
              <Search size={14} className="search-icon" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar playlist..."
                className="search-input"
              />
            </div>
          </div>
        )}

        <div className="sidebar-list">
          {playlists.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/dashboard/playlist/${item.id}`)}
              className="playlist-item"
            >
              <div className="playlist-thumb">
                {item.games?.[0]?.url_image ? (
                  <img
                    src={item.games[0].url_image}
                    className="playlist-img"
                  />
                ) : (
                  <div className="playlist-fallback">
                    <Library size={16} />
                  </div>
                )}
              </div>

              {!isCompact && (
                <div className="playlist-title">
                  <span>{item.title}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      <DialogCreatePlaylist
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onCreated={resetAndReload}
      />
    </>
  );
}
