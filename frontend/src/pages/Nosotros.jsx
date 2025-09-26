import { Box, Typography, Container } from "@mui/material";

const Nosotros = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Sobre Nosotros
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Conoce más sobre Divino Diseño
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          Esta página estará disponible próximamente. Aquí encontrarás información sobre nuestra empresa, 
          nuestra historia, misión y valores.
        </Typography>
      </Box>
    </Container>
  );
};

export default Nosotros;