"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";

type Game = {
  title: string;
  price: string;
  discount_price: string;
  review_rating: number;
  total_reviews: number;
  url_image: string;
  url_steam: string;
};

const theme = {
  surface: "#121212",
  border: "#2A2A2A",
  text: "#FFFFFF",
  muted: "#A1A1A1",
};

export function DialogGame({
  open,
  onOpenChange,
  gameId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string | null;
}) {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    if (!gameId || !open) return;

    async function loadGame() {
      try {
        const res = await fetch(
          `https://programacao-para-redes-exa618-projeto.onrender.com/api/games/${gameId}/`,
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setGame(data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    loadGame();
  }, [gameId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          width: "92%",
          maxWidth: "420px",
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: "24px",
          color: theme.text,
        }}
      >
        <DialogTitle className="sr-only">Game</DialogTitle>
        <DialogDescription className="sr-only">
          Detalhes do jogo
        </DialogDescription>

        {!game ? (
          <p style={{ color: theme.muted }}>Carregando...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <img
              src={game.url_image}
              style={{
                width: "100%",
                borderRadius: 8,
                objectFit: "cover",
              }}
            />

            <h2 style={{ fontSize: 18, fontWeight: 600 }}>
              {game.title}
            </h2>

            <div style={{ display: "flex", gap: 10 }}>
              <span>⭐ {game.review_rating}</span>
              <span>{game.total_reviews} reviews</span>
            </div>

            <div>
              <span>
                {game.discount_price || game.price}
              </span>
            </div>

            <a
              href={game.url_steam}
              target="_blank"
              style={{
                marginTop: 10,
                color: "#1DB954",
                textDecoration: "underline",
              }}
            >
              Abrir na Steam
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}