import { useEffect, useRef, useState, useCallback } from "react";
import { GameCard } from "../components/GameCard";
import { Skeleton } from "../components/ui/skeleton";
import type { Game } from "../models/Game";

export function GamesGrid() {
  const [data, setData] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(
    "https://programacao-para-redes-exa618-projeto.onrender.com/api/games/"
  );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

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
        const refresh = await fetch(
          "https://programacao-para-redes-exa618-projeto.onrender.com/api/auth/refresh/",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (refresh.ok) {
          response = await fetch(nextUrl, {
            method: "GET",
            credentials: "include",
          });
        }
      }

      if (!response.ok) return;

      const json = await response.json();

      setData((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));

        const newItems: Game[] = [];
        for (const item of json.results) {
          if (!existingIds.has(item.id)) {
            newItems.push(item);
          }
        }

        if (newItems.length === 0) {
          setNextUrl(null);
          return prev;
        }

        return prev.concat(newItems);
      });

      setNextUrl(json.next ? json.next.replace("http://", "https://") : null);
    } catch (err) {
      console.log("Erro:", err);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [nextUrl]);

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !nextUrl) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isFetchingRef.current) {
          loadMore();
        }
      },
      {
        rootMargin: "300px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [nextUrl, loadMore]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
      {data.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}

      <div ref={loadMoreRef} className="h-10 col-span-full" />

      {isLoading && (
        <div className="col-span-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      )}
    </div>
  );
}