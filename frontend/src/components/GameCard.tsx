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
    <Card sx={{ maxWidth: 500 }}>
      <CardMedia
        sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            transition: "0.3s",
            display: "block",
          }}
        image={game.url_image}
      />
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
