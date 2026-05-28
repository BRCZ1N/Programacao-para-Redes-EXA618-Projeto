import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";

type Game = {
  id: string;
  title: string;
  url_image: string;
};

export function GameCard({
  game,
  onSelect,
}: {
  game: Game;
  onSelect: (id: string) => void;
}) {
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 500,
        backgroundColor: "black",
      }}
    >
      <CardActionArea onClick={() => onSelect(game.id)}>
        <CardMedia
          sx={{
            width: "100%",
            aspectRatio: "16 / 9",
          }}
          image={game.url_image}
        />
      </CardActionArea>
    </Card>
  );
}