import { Box, Typography, Container } from "@mui/material";

const Contacto = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Contacto
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Ponte en contacto con nosotros
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          Esta página estará disponible próximamente. Aquí encontrarás nuestros datos de contacto, 
          formulario de consultas y ubicación.
        </Typography>
      </Box>
    </Container>
  );
};

export default Contacto;