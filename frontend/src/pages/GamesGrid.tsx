import { useEffect, useState } from "react";
import { GameCard } from "../components/GameCard";
import { PaginationGames } from "../components/PaginationGames";
import { Skeleton } from "../components/ui/skeleton";

type Game = {
  id: string;
  title: string;
  url_image: string;
};

export function GamesGrid() {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Game[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {

    async function load() {
      setIsLoading(true);
      try {
        let response = await fetch(`http://localhost:8000/api/games/?page=${page}`, {
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
            response = await fetch("http://localhost:8000/api/games/", {
              method: "GET",
              credentials: "include",
            });
          }
        }

        if (response.ok) {
          const data = await response.json();
          setData(data.results);
          setTotalPages
          setIsLoading(false);
        }
      } catch (error) {
        console.log("Erro na requisição:", error);
      }
    }

    load();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
      {isLoading
        ? Array.from({ length: 16 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))
        : data.map((game) => <GameCard key={game.id} game={game} />)}
      <PaginationGames
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        />
    </div>   
  );
}
