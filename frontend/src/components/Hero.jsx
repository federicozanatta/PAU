import { Box, Typography, Button } from "@mui/material";
import hero from "../assets/hero.png";

const Hero = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundImage: `url(${hero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 3,
        marginBottom: 2,
      }}
    >
      <Typography variant="h3" fontWeight="bold" color="secondary">
        ¡Atención DOCENTES!
      </Typography>
      <Typography variant="h6" color="accent" sx={{ mt: 2 }}>
        ¡Descuento especial para docentes que abonen con Mercado Pago!
      </Typography>
      <Button variant="contained" color="secondary" sx={{ mt: 3 }}>
        Comprar Ahora
      </Button>
    </Box>
  );
};

export default Hero;
