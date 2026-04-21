import { SideStack } from "../components/SideStack"
import { SideStackSkeleton } from "../components/SideStackSkeleton"
import { useEffect, useState } from "react"

export function PlaylistGrid() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)

      const res = await fetch("/api/playlists")
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
            <SideStackSkeleton key={i} />
          ))
        : data.map((item) => (
            <SideStack key={item.id} games={item.games} />
          ))}
    </div>
  )
}