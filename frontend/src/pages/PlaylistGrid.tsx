import { useEffect, useRef, useState } from "react";
import type { Playlist } from "../models/Playlist";
import { EmptyDemo } from "../components/EmptyDemo";
import { PlaylistCard } from "../components/PlaylistCard";
import { FakePlaylistCard } from "../components/FakePlaylistCard";
import { apiFetch } from "../fetcher/Fetcher";
import { PlaylistDrawer } from "../components/PlaylistDrawer";

export function PlaylistGrid() {
  const [data, setData] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFetchingRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist>();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(
    "http://localhost:8000/api/playlist/",
  );

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

  async function handleGeneratePlaylist() {
    try {
      const response = await apiFetch("http://localhost:8000/api/playlist/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "auto",
        }),
      });

      if (!response.ok) return;

      const data: Playlist = await response.json();

    
      setPlaylist(data);
      setOpen(true);

      setData((prev) => [data, ...prev]);
    } catch (error) {
      console.log("Erro na requisição:", error);
    }
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
        <EmptyDemo />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          <FakePlaylistCard onClick={handleGeneratePlaylist} />

          {data.map((item) => (
            <PlaylistCard key={item.id} games={item.games} />
          ))}

          <div ref={loadMoreRef} />

          {isLoading && (
            <div className="col-span-full text-center py-4">Carregando...</div>
          )}

          <PlaylistDrawer
            open={open}
            onOpenChange={setOpen}
            playlist={playlist}
            onGenerateAgain={handleGeneratePlaylist}
          />
        </div>
      )}
    </>
  );
}
