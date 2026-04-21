import { useEffect, useState } from "react"
import { GameCard } from "../components/GameCard"
import { Skeleton } from "../components/ui/skeleton"

type Game = {
  id: string
  title: string
  imageUrl: string
}

export function GamesGrid() {
  const [data, setData] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)

      const res = await fetch("/api/games")
      const json = await res.json()

      setData(json)
      setIsLoading(false)
    }

    load()
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))
        : data.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
    </div>
  )
}