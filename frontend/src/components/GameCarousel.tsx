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
  discount_price: string;
  url_image: string;
};

type SkeletonItem = {
  id: string;
  isSkeleton: true;
};

async function fetchGames(type: string): Promise<Game[]> {
  const res = await fetch(`http://programacao-para-redes-exa618-projeto.onrender.com/api/games/featured?type=${type}`);

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
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );

  const [games, setGames] = React.useState<Game[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);

    fetchGames(type)
      .then((data) => setGames(data))
      .finally(() => setLoading(false));
  }, [type]);

  const skeletons: SkeletonItem[] = React.useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: `skeleton-${i}`,
        isSkeleton: true as const,
      })),
    [],
  );

  const items = loading ? skeletons : games;

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
            {items.map((item, index) => (
              <CarouselItem
                key={loading ? `skeleton-${index}` : `game-${index}`}
                className="basis-1/2 md:basis-1/3 lg:basis-1/5 p-2"
              >
                {loading ? (
                  <Card className="h-40 animate-pulse" />
                ) : (
                  <Card className="overflow-hidden hover:scale-[1.02] transition">
                    <CardContent className="p-0">
                      <div className="w-full overflow-hidden">
                        <img
                          src={(item as Game).url_image}
                          alt={(item as Game).title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-2 space-y-1">
                        <p className="text-sm font-medium truncate">
                          {(item as Game).title}
                        </p>

                        <div className="flex justify-between text-xs">
                          {(item as Game).discount_price ? (
                            <>
                              <span className="line-through text-muted-foreground">
                                R$ {(item as Game).price}
                              </span>
                              <span className="text-green-500 font-semibold">
                                R$ {(item as Game).discount_price}
                              </span>
                            </>
                          ) : (
                            <span>R$ {(item as Game).price}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}