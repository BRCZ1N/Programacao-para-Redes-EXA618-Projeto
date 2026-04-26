import { useEffect, useRef, useState, useCallback } from "react";
import type { Playlist } from "../models/Playlist";
import { EmptyDemo } from "../components/EmptyDemo";
import { PlaylistCard } from "../components/PlaylistCard";
import { FakePlaylistCard } from "../components/FakePlaylistCard";
import { PlaylistDrawer } from "../components/PlaylistDrawer";
import { DialogCreatePlaylist } from "../components/DialogPlaylistCreate";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export function PlaylistGrid() {
  const [data, setData] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isFetchingRef = useRef(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false);

  const [nextUrl, setNextUrl] = useState<string | null>(
    "http://localhost:8000/api/playlist/"
  );

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextUrl || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      let response = await fetch(nextUrl, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        const refreshResponse = await fetch(
          "http://localhost:8000/api/auth/refresh/",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (refreshResponse.ok) {
          response = await fetch(nextUrl, {
            method: "GET",
            credentials: "include",
          });
        }
      }

      if (response.ok) {
        const json = await response.json();

        setData((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const newItems = json.results.filter((i: any) => !ids.has(i.id));

          if (newItems.length === 0) {
            setNextUrl(null);
            return prev;
          }

          return [...prev, ...newItems];
        });

        setNextUrl(json.next);
      }
    } catch (error) {
      console.log("Erro:", error);
    } finally {
      setTimeout(() => {
        isFetchingRef.current = false;
        setIsLoading(false);
      }, 250); // debounce leve anti spam
    }
  }, [nextUrl]);

  async function deletePlaylists(ids: string[]) {
    try {
      let response = await fetch("http://localhost:8000/api/playlist/", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });

      if (response.status === 401) {
        const refreshResponse = await fetch(
          "http://localhost:8000/api/auth/refresh/",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (refreshResponse.ok) {
          response = await fetch("http://localhost:8000/api/playlist/", {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids }),
          });
        }
      }

      if (response.ok) {
        setData((prev) => prev.filter((item) => !ids.includes(item.id)));
        setSelectedIds([]);
      }
    } catch (error) {
      console.log("Erro:", error);
    }
  }

  function handleGeneratePlaylist() {
    setOpenCreatePlaylist(true);
  }

  function handleCreatedPlaylist(newPlaylist: Playlist) {
    setData((prev) => [newPlaylist, ...prev]);
    setPlaylist(newPlaylist);
    setOpen(true);
  }

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  useEffect(() => {
    if (!nextUrl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !isFetchingRef.current) {
          loadMore();
        }
      },
      { rootMargin: "300px" }
    );

    const current = loadMoreRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
      observer.disconnect();
    };
  }, [nextUrl, loadMore]);

  return (
    <>
      {data.length === 0 && !isLoading ? (
        <FakePlaylistCard onClick={handleGeneratePlaylist}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          <FakePlaylistCard onClick={handleGeneratePlaylist} />

          {data.map((item) => (
            <PlaylistCard
              key={item.id}
              games={item.games}
              title={item.title}
              selected={selectedIds.includes(item.id)}
              onSelect={() => toggleSelect(item.id)}
            />
          ))}

          <div ref={loadMoreRef} />

          {isLoading && (
            <div className="col-span-full text-center py-4">
              Carregando...
            </div>
          )}
        </div>
      )}

      <PlaylistDrawer
        open={open}
        onOpenChange={setOpen}
        playlist={playlist}
        onGenerateAgain={handleGeneratePlaylist}
      />

      <DialogCreatePlaylist
        open={openCreatePlaylist}
        onOpenChange={setOpenCreatePlaylist}
        onCreated={handleCreatedPlaylist}
      />

      {selectedIds.length > 0 && (
        <AppBar
          position="fixed"
          sx={{
            top: "auto",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: "fit-content",
            px: 1,
            py: 0.3,
            backgroundColor: "rgba(0,0,0,0.9)",
            boxShadow: "none",
          }}
        >
          <Toolbar
            sx={{
              minHeight: "unset",
              height: "auto",
              display: "flex",
              gap: 1,
              px: 1,
            }}
          >
            <Typography variant="caption">
              {selectedIds.length} selecionado
              {selectedIds.length > 1 ? "s" : ""}
            </Typography>

            <Button size="small" onClick={() => setSelectedIds([])}>
              Desfazer
            </Button>

            <Button size="small" onClick={() => deletePlaylists(selectedIds)}>
              Excluir
            </Button>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
}