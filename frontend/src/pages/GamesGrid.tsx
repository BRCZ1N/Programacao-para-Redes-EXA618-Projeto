import { useEffect, useRef, useState } from "react";
import { GameCard } from "../components/GameCard";
import { Skeleton } from "../components/ui/skeleton";
import type { Game } from "../models/Game";

export function GamesGrid() {
  const [data, setData] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(
    "http://localhost:8000/api/games/"
  );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

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
          const newItems = json.results.filter(
            (item: Game) => !prev.some((p) => p.id === item.id)
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
      { rootMargin: "200px" }
    );

    const current = loadMoreRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [nextUrl]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
      {data.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}

      <div ref={loadMoreRef} className="h-10 col-span-full" />

      {isLoading &&
        Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
    </div>
  );
}