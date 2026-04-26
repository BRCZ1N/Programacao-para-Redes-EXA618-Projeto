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
        height: "100%",
        bgcolor: "rgba(30, 41, 59, 0.4)",
        border: "1px dashed",
        borderColor: "rgba(51, 65, 85, 1)",
        cursor: "pointer",
        boxShadow: "none",
        borderRadius: 2,
        overflow: "hidden",
        transition: "0.2s ease",
        "&:hover": {
          bgcolor: "rgba(30, 41, 59, 0.7)",
          borderColor: "#64748b",
          transform: "translateY(-2px)",
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
          gap: 1,
          color: "#94a3b8",
          transition: "0.2s ease",
          "&:hover": {
            color: "#e2e8f0",
          },
        }}
      >
        <AddIcon sx={{ fontSize: 28 }} />
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "inherit",
          }}
        >
          Criar playlist
        </Typography>
      </Box>
    </Card>
  );
}
