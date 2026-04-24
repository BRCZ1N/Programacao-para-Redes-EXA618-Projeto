"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";

import { Card, CardContent } from "../components/ui/card";

type Game = {
  id: number;
  title: string;
  price: number;
  discount_price?: number;
  url_image: string;
};

async function fetchGames(type: string): Promise<Game[]> {
  const res = await fetch(`/api/games/featured?type=${type}`);

  if (!res.ok) throw new Error("Erro ao buscar jogos");

  return res.json();
}

export function GameCarousel({
  title,
  type,
}: {
  title: string;
  type: "trending" | "new" | "top";
}) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const [games, setGames] = React.useState<Game[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);

    fetchGames(type)
      .then((data) => setGames(data))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <section className="space-y-3">
      <h2 className="text-center text-xl font-bold">{title}</h2>

      <div className="relative w-full overflow-hidden px-6">
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full"
        >
          <CarouselContent>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <CarouselItem
                    key={i}
                    className="basis-1/2 md:basis-1/3 lg:basis-1/5"
                  >
                    <div className="p-2">
                      <Card className="h-40 animate-pulse" />
                    </div>
                  </CarouselItem>
                ))
              : games.map((game) => (
                  <CarouselItem
                    key={game.id}
                    className="basis-1/2 md:basis-1/3 lg:basis-1/5"
                  >
                    <div className="p-2">
                      <Card className="overflow-hidden hover:scale-[1.02] transition">
                        <CardContent className="p-0">
                          
                          <div className="fl w-full overflow-hidden">
                            <img
                              src={game.url_image}
                              alt={game.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* INFO */}
                          <div className="p-2 space-y-1">
                            <p className="text-sm font-medium truncate">
                              {game.title}
                            </p>

                            <div className="flex justify-between text-xs">
                              {game.discount_price ? (
                                <>
                                  <span className="line-through text-muted-foreground">
                                    R$ {game.price}
                                  </span>
                                  <span className="text-green-500 font-semibold">
                                    R$ {game.discount_price}
                                  </span>
                                </>
                              ) : (
                                <span>R$ {game.price}</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}