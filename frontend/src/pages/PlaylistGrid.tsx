import { useEffect, useState } from "react";
import type { Playlist } from "../models/Playlist";
import { PlaylistCard } from "../components/PlaylistCard";
import { Skeleton } from "../components/ui/skeleton";
import { PaginationGames } from "../components/PaginationGames";

export function PlaylistGrid() {
  const [data, setData] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        let response = await fetch(
          `http://localhost:8000/api/playlist/?page=${page}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (response.status === 401) {
          const refreshResponse = await fetch(
            "http://localhost:8000/api/auth/refresh/",
            {
              method: "POST",
              credentials: "include",
            },
          );

          if (refreshResponse.ok) {
            response = await fetch(
              `http://localhost:8000/api/playlist/?page=${page}`,
              {
                method: "GET",
                credentials: "include",
              },
            );
          }
        }

        if (response.ok) {
          const data = await response.json();
          setData(data.results);
          setTotalPages(data.totalPages);
          setPage(data.page);
          setIsLoading(false);
        }
      } catch (error) {
        console.log("Erro na requisição:", error);
      }
    }

    load();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
        {isLoading
          ? Array.from({ length: 16 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))
          : (data ?? []).map((item) => (
              <PlaylistCard
                key={item.id}
                games={item.games}
                title={item.title} // se tiver nome
              />
            ))}
      </div>
      <div className="flex gap-3 p-4 flex-1">
        <PaginationGames
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
