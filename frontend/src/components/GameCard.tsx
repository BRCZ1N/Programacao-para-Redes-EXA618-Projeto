import { Card, CardHeader, CardTitle, CardDescription } from "../components/ui/card"

type Game = {
  id: string
  title: string
  imageUrl: string
  description?: string
}

export function GameCard({ game }: { game: Game }) {
  return (
    <Card className="relative overflow-hidden pt-0 group">
      <div className="absolute inset-0 z-10 bg-black/30" />

      <img
        src={game.imageUrl}
        className="relative z-0 h-40 w-full object-cover group-hover:scale-105 transition"
      />

      <CardHeader className="relative z-20">
        <CardTitle className="text-sm">{game.title}</CardTitle>

        {game.description && (
          <CardDescription className="text-xs">
            {game.description}
          </CardDescription>
        )}
      </CardHeader>
    </Card>
  )
}