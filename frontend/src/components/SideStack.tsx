import { Link } from "react-router-dom";
import type {Game} from "../models/Game"


export function SideStack({ games }: { games: Game[] }) {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9]">
      {games.slice(0, 5).map((game, index) => {
        const offset = index * 15
        const scale = 1 - index * 0.04

        return (
          <Link
            key={game.id}
            to={`/playlist/${game.id}`}
            className="absolute top-0 left-0 h-full w-[65%] overflow-hidden rounded-xl border bg-background shadow-md transition hover:translate-x-2 hover:scale-105 hover:z-50"
            style={{
              transform: `translateX(${offset}px) scale(${scale})`,
              zIndex: 10 - index,
            }}
          >
            <img
              src={game.url_image}
              className="h-full w-full object-cover"
            />

            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-xs font-semibold text-white truncate">
                {game.title}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
