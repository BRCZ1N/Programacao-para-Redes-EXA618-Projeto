import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';

type Game = {
  id: string;
  title: string;
  url_image: string;
};

export function GameCard({ game }: { game: Game }) {
  return (
    <Card sx={{
        width: "100%",
        maxWidth: 500,
        backgroundColor: "black",
      }}>
      <CardActionArea>
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
