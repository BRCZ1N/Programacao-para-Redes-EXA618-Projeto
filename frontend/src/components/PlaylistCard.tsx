import {
  Card,
  Box,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";

import type { GameTeste } from "../models/Game";

type Props = {
  games: GameTeste[];
  title?: string;
};

export function PlaylistCard({ games, title }: Props) {
  return (
    <Card sx={{ width: "100%" }}>
      <CardActionArea>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            overflow: "hidden",
          }}
        >
          {games.slice(0, 4).map((game, index) => (
            <Box
              key={index}
              component="img"
              src={game.url_image}
              alt={title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ))}
        </Box>

        {/* CONTENT */}
        <CardContent>
          <Typography gutterBottom variant="h6">
            {title ?? "Playlist"}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
