import { Card, Box } from "@mui/material";

type Game = {
  id: string;
  title: string;
  url_image: string;
};

export function GameCard({ game }: { game: Game }) {
  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        pt: 0,
        "&:hover img": {
          transform: "scale(1.05)",
        },
      }}
    >
        <Box
          component="img"
          src={game.url_image}
          alt={game.title}
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            transition: "0.3s",
            display: "block",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 1,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            zIndex: 2,
            p: 2,
          }}
        ></Box>
    </Card>
  );
}
