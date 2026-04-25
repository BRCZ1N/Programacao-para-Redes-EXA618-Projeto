import { useEffect, useRef, useState } from "react";
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

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [open, setOpen] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [nextUrl, setNextUrl] = useState<string | null>(
    "http://localhost:8000/api/playlist/",
  );

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function loadMore() {
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
          },
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
          const newItems = json.results.filter(
            (item: any) => !prev.some((p) => p.id === item.id),
          );

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
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }

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
          },
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
      } else {
        console.log("Erro ao deletar");
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
  }, []);

  useEffect(() => {
    if (!nextUrl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    const current = loadMoreRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [nextUrl]);

  return (
    <>
      {data.length === 0 && !isLoading ? (
          <EmptyDemo
            action={<FakePlaylistCard onClick={handleGeneratePlaylist} />}
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
            <div className="col-span-full text-center py-4">Carregando...</div>
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
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Toolbar
            sx={{
              minHeight: "unset",
              height: "auto",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              px: 1,
            }}
          >
            <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
              {selectedIds.length} selecionad
              {selectedIds.length > 1 ? "os" : "o"}
            </Typography>

            <Button
              size="small"
              onClick={() => setSelectedIds([])}
              sx={{
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              Desfazer
            </Button>

            <Button
              size="small"
              onClick={() => deletePlaylists(selectedIds)}
              sx={{
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              Excluir
            </Button>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
}
