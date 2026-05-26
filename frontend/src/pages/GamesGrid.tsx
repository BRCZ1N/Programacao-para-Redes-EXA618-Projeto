import { useEffect, useState } from "react";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import { GameCard } from "../components/GameCard";
import { Skeleton } from "../components/ui/skeleton";

import type { Game } from "../models/Game";

type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
};

const PAGE_SIZE = 16;

export function GamesGrid() {
  const [games, setGames] = useState<Game[]>([]);
  const [count, setCount] = useState(0);

  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  async function fetchGames(currentPage: number) {
    setIsLoading(true);

    try {
      let response = await fetch(
        `https://programacao-para-redes-exa618-proje.vercel.app/api/games/?page=${currentPage}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (response.status === 401) {
        const refresh = await fetch("https://programacao-para-redes-exa618-proje.vercel.app/api/auth/refresh/", {
          method: "POST",
          credentials: "include",
        });

        if (refresh.ok) {
          response = await fetch(
            `https://programacao-para-redes-exa618-proje.vercel.app/api/games/?page=${currentPage}`,
            {
              method: "GET",
              credentials: "include",
            },
          );
        }
      }

      if (!response.ok) return;

      const json: ApiResponse = await response.json();

      setGames(json.results);
      setCount(json.count);
    } catch (err) {
      console.log("Erro:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames(page);
  }, [page]);

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <div className="flex flex-col min-h-screen w-full p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {games.length === 0 && isLoading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))
          : games.map((game) => <GameCard key={game.id} game={game} />)}
      </div>

      <div className="flex justify-center flex-1">
        <Stack spacing={2}>
          <Pagination
            page={page}
            siblingCount={0} 
            boundaryCount={1}
            count={totalPages}
            onChange={(_, value) => {
              setPage(value);
            }}
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "white",
                borderColor: "white",
              },

              "& .Mui-selected": {
                backgroundColor: "white !important",
                color: "black",
              },
            }}
          />
        </Stack>
      </div>
    </div>
  );
}
