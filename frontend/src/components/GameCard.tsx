import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

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
      <CardMedia
       sx={{
          width: "100%",
          aspectRatio: "16 / 9",
        }}
        image={game.url_image}
      />
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
