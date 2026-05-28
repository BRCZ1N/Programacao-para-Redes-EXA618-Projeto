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
      const res = await fetch(
        `https://programacao-para-redes-exa618-projeto.onrender.com/api/games/${gameId}/`,
        { credentials: "include" },
      );

      if (res.ok) {
        setGame(await res.json());
      }
    }

    loadGame();
  }, [gameId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          width: "92%",
          maxWidth: "520px",
          background: "rgba(18,18,18,0.95)",
          border: `1px solid ${theme.border}`,
          borderRadius: 16,
          padding: 0,
          overflow: "hidden",
          color: theme.text,
          backdropFilter: "blur(12px)",
        }}
      >
        <DialogTitle className="sr-only">Game</DialogTitle>
        <DialogDescription className="sr-only" />

        {!game ? (
          <div style={{ padding: 24, color: theme.muted }}>Carregando...</div>
        ) : (
          <div>
            <div style={{ position: "relative" }}>
              <img
                src={game.url_image}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                }}
              />
            </div>

            <div
              style={{
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{game.title}</h2>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  color: theme.muted,
                  fontSize: 13,
                }}
              >
                <span>⭐ {game.review_rating}</span>
                <span>{game.total_reviews} reviews</span>
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {game.discount_price || game.price}
              </div>

              <a
                href={game.url_steam}
                target="_blank"
                style={{
                  marginTop: 12,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "#1DB954",
                  color: "#000",
                  fontWeight: 600,
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Abrir na Steam
              </a>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
