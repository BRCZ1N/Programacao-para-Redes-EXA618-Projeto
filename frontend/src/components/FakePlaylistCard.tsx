import { Card, Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type Props = {
  onClick: () => void;
};

export function FakePlaylistCard({ onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: "100%",
        border: "1px dashed",
        cursor: "pointer",
        overflow: "hidden",
        boxShadow: "none",
        transition: "0.2s",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 1,
        }}
      >
        <AddIcon />

        <Typography variant="body2">Criar playlist</Typography>
      </Box>
    </Card>
  );
}
