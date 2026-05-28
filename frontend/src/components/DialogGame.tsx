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
  description: string;
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
        { credentials: "include" }
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
          maxWidth: "600px",
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
          <div style={{ padding: 24, color: theme.muted }}>
            Carregando...
          </div>
        ) : (
          <div>
            <div style={{ position: "relative" }}>
              <img
                src={game.url_image}
                style={{
                  width: "100%",
                  height: 240,
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                }}
              />
            </div>

            <div
              style={{
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>
                {game.title}
              </h2>

              <p
                style={{
                  fontSize: 13,
                  color: theme.muted,
                  lineHeight: 1.5,
                }}
              >
                {game.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  rowGap: 10,
                  columnGap: 12,
                  fontSize: 13,
                }}
              >
                <span style={{ color: theme.muted }}>Avaliação</span>
                <span>⭐ {game.review_rating}</span>

                <span style={{ color: theme.muted }}>Total de reviews</span>
                <span>{game.total_reviews}</span>

                <span style={{ color: theme.muted }}>Preço original</span>
                <span>{game.price}</span>

                <span style={{ color: theme.muted }}>Preço com desconto</span>
                <span style={{ color: "#1DB954", fontWeight: 700 }}>
                  {game.discount_price || "Sem desconto"}
                </span>
              </div>

              <div
                style={{
                  marginTop: 6,
                  padding: 12,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: theme.muted, fontSize: 12 }}>
                  Melhor preço
                </span>
                <span style={{ fontSize: 18, fontWeight: 700 }}>
                  {game.discount_price || game.price}
                </span>
              </div>

        
              <a
                href={game.url_steam}
                target="_blank"
                style={{
                  marginTop: 10,
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: "#1DB954",
                  color: "#000",
                  fontWeight: 700,
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