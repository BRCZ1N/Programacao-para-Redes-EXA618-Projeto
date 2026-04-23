import { useEffect, useRef, useState } from "react";
import type { Playlist } from "../models/Playlist";
import { PlaylistCard } from "../components/PlaylistCard";

export function PlaylistGrid() {
  const [data, setData] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFetchingRef = useRef(false);
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {data.map((item) => (
        <PlaylistCard key={item.id} games={item.games} />
      ))}

      <div ref={loadMoreRef} />

      {isLoading && (
        <div className="col-span-full text-center py-4">Carregando...</div>
      )}
    </div>
  );
}
