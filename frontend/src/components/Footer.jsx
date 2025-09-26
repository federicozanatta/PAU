import { Box, Container, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#333", color: "white", py: 3 }}>
      <Container maxWidth="lg">
        {/* Información de contacto */}
        <Typography variant="h6">Contacto</Typography>
        <Typography variant="body2">Email: divinodiseno@gmail.com</Typography>
        <Typography variant="body2">Teléfono: +54 9 1234 5678</Typography>

        {/* Enlaces útiles */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Para más info</Typography>
          <Link href="/about" variant="body2" color="inherit" underline="hover">
            Sobre Nosotros
          </Link>
          {" | "}
          <Link href="/faq" variant="body2" color="inherit" underline="hover">
            Preguntas Frecuentes
          </Link>
          {" | "}
          <Link href="/terms" variant="body2" color="inherit" underline="hover">
            Términos y Condiciones
          </Link>
        </Box>

        {/* Redes sociales */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Síguenos</Typography>
          <IconButton color="inherit" href="https://facebook.com">
            <FacebookIcon />
          </IconButton>
          <IconButton color="inherit" href="https://instagram.com">
            <InstagramIcon />
          </IconButton>
          <IconButton color="inherit" href="https://twitter.com">
            <TwitterIcon />
          </IconButton>
        </Box>

        {/* Copyright */}
        <Typography
          variant="body2"
          color="accent"
          sx={{ mt: 2, textAlign: "center" }}
        >
          © 2025 Divino Diseño - Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
