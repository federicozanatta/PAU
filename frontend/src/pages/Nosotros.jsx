import { Box, Container, Paper, Typography, Grid, Card, CardContent, Stack, Divider } from "@mui/material";
import { 
  School as SchoolIcon, 
  Palette as PaletteIcon, 
  LocalPrintshop as PrintIcon,
  AttachMoney as MoneyIcon,
  Favorite as HeartIcon,
  EmojiObjects as IdeaIcon
} from "@mui/icons-material";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import Footer from "../components/Footer";

const SobreNosotros = () => {
  const valores = [
    {
      icon: <SchoolIcon sx={{ fontSize: 50, color: "primary.main" }} />,
      titulo: "Apoyo a la educación",
      descripcion: "Nos dedicamos a facilitar el acceso a materiales educativos de calidad para docentes y estudiantes."
    },
    {
      icon: <MoneyIcon sx={{ fontSize: 50, color: "success.main" }} />,
      titulo: "Precios accesibles",
      descripcion: "Ofrecemos productos y servicios a precios económicos, porque creemos que la educación debe ser accesible para todos."
    },
    {
      icon: <PaletteIcon sx={{ fontSize: 50, color: "secondary.main" }} />,
      titulo: "Diseños personalizados",
      descripcion: "Creamos diseños únicos adaptados a tus necesidades, desde material didáctico hasta proyectos creativos."
    },
    {
      icon: <PrintIcon sx={{ fontSize: 50, color: "info.main" }} />,
      titulo: "Impresiones de calidad",
      descripcion: "Utilizamos tecnología de impresión moderna para garantizar resultados profesionales en cada trabajo."
    }
  ];

  const servicios = [
    {
      titulo: "Librería completa",
      descripcion: "Amplio catálogo de productos escolares, universitarios y de oficina para todas tus necesidades."
    },
    {
      titulo: "Diseño gráfico",
      descripcion: "Creamos material educativo, infografías, presentaciones y cualquier diseño que necesites."
    },
    {
      titulo: "Impresiones económicas",
      descripcion: "Impresión de apuntes, trabajos prácticos, láminas y materiales didácticos a precios especiales."
    },
    {
      titulo: "Atención personalizada",
      descripcion: "Te asesoramos en cada proyecto para lograr los mejores resultados según tus requerimientos."
    }
  ];

  return (
    <>
      <Header />
      <FilterBar />
      <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 6 }}>
        <Container maxWidth="lg">
          
          {/* Hero Section */}
          <Paper elevation={3} sx={{ p: 6, mb: 4, borderRadius: 3, textAlign: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <HeartIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Sobre Nosotros
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 700, mx: "auto", lineHeight: 1.8, opacity: 0.95 }}>
              Somos tu aliado en el mundo educativo, ofreciendo productos de librería, diseños creativos e impresiones de calidad a precios accesibles.
            </Typography>
          </Paper>

          {/* Nuestra Historia */}
          <Paper elevation={2} sx={{ p: 5, mb: 4, borderRadius: 3 }}>
            <Stack spacing={3} alignItems="center">
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <IdeaIcon sx={{ fontSize: 50, color: "warning.main", mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  Nuestra Historia
                </Typography>
              </Box>
              
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, textAlign: "center", maxWidth: 800, mx: "auto" }}>
                Nacimos con la misión de apoyar a docentes y estudiantes en su día a día, brindando no solo productos de librería de calidad, sino también soluciones creativas y económicas para sus proyectos educativos.
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, textAlign: "center", maxWidth: 800, mx: "auto" }}>
                Entendemos los desafíos que enfrentan educadores y alumnos, por eso nos especializamos en ofrecer diseños personalizados e impresiones a precios justos, sin comprometer la calidad. Cada trabajo que realizamos está pensado para facilitar el aprendizaje y potenciar la creatividad.
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, textAlign: "center", maxWidth: 800, mx: "auto" }}>
                Hoy somos más que una librería: somos un espacio donde las ideas cobran vida, donde cada proyecto tiene un valor especial y donde la educación encuentra las herramientas que necesita para crecer.
              </Typography>
            </Stack>
          </Paper>
{/* Nuestros Valores */}
<Box sx={{ mb: 4 }}>
  <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 4 }}>
    Nuestros Valores
  </Typography>
  <Grid container spacing={3} justifyContent="center">
    {valores.map((valor, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <Card 
          elevation={2}
          sx={{ 
            height: "100%",
            width: "800px",
            p: 3,
            textAlign: "center",
            borderRadius: 3,
            transition: "all 0.3s",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: 6
            }
          }}
        >
          <Box sx={{ mb: 2 }}>
            {valor.icon}
          </Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {valor.titulo}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {valor.descripcion}
          </Typography>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>

<Divider sx={{ my: 5 }} />

{/* Nuestros Servicios */}
<Box sx={{ mb: 4 }}>
  <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 4 }}>
    Lo Que Ofrecemos
  </Typography>
  <Grid container spacing={3} justifyContent="center">
    {servicios.map((servicio, index) => (
      <Grid item xs={12} md={6} key={index}>
        <Card 
          elevation={0}
          sx={{ 
            p: 3,
            border: "2px solid #e0e0e0",
            borderRadius: 2,
            width: "800px",
            height: "100%",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "primary.main",
              boxShadow: 3
            }
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold"  gutterBottom>
              {servicio.titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {servicio.descripcion}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>

          {/* Call to Action */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 5, 
              mt: 4, 
              borderRadius: 3, 
              textAlign: "center",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white"
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              ¿Listo para comenzar tu proyecto?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.95 }}>
              Contáctanos y descubre cómo podemos ayudarte con tus necesidades educativas y creativas.
            </Typography>
            <Typography variant="h6" fontWeight="medium">
              ¡Estamos aquí para hacer realidad tus ideas!
            </Typography>
          </Paper>

        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default SobreNosotros;