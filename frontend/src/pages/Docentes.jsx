import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack
} from "@mui/material";
import { 
  MenuBook as BookIcon,
  Article as ArticleIcon,
  TipsAndUpdates as TipsIcon,
  ArrowForward as ArrowIcon,
  CalendarMonth as CalendarIcon
} from "@mui/icons-material";
import { EmojiObjects as IdeaIcon } from "@mui/icons-material";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import Footer from "../components/Footer";

const Docentes = () => {
  const noticias = [
    {
      id: 1,
      titulo: "10 Estrategias Innovadoras para Captar la Atención de tus Alumnos",
      descripcion: "Descubre técnicas creativas y probadas para mantener el interés de los estudiantes en cada clase, desde dinámicas grupales hasta el uso inteligente de recursos visuales.",
      categoria: "Innovación",
      fecha: "15 Octubre 2025",
      imagen: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=300&fit=crop",
      destacado: true
    },
    {
      id: 2,
      titulo: "Herramientas Digitales Gratuitas para Docentes en 2025",
      descripcion: "Una selección de las mejores plataformas y aplicaciones gratuitas que todo educador debería conocer para optimizar su trabajo y enriquecer sus clases.",
      categoria: "Tecnología",
      fecha: "12 Octubre 2025",
      imagen: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=500&h=300&fit=crop",
      destacado: true
    },
    {
      id: 3,
      titulo: "Cómo Crear Material Didáctico Efectivo con Poco Presupuesto",
      descripcion: "Consejos prácticos y económicos para diseñar recursos educativos de calidad sin gastar de más, aprovechando materiales reciclados y herramientas accesibles.",
      categoria: "Recursos",
      fecha: "8 Octubre 2025",
      imagen: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&h=300&fit=crop",
      destacado: false
    },
    {
      id: 4,
      titulo: "La Importancia de la Retroalimentación Constructiva",
      descripcion: "Aprende técnicas para dar feedback efectivo que motive a tus estudiantes y mejore su rendimiento académico de manera significativa.",
      categoria: "Didáctica",
      fecha: "5 Octubre 2025",
      imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop",
      destacado: false
    },
    {
      id: 5,
      titulo: "Organización de Clases: Tips para Docentes Ocupados",
      descripcion: "Estrategias de gestión del tiempo y organización que te ayudarán a planificar mejor tus clases y reducir el estrés diario.",
      categoria: "Consejos",
      fecha: "1 Octubre 2025",
      imagen: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&h=300&fit=crop",
      destacado: false
    },
    {
      id: 6,
      titulo: "Inteligencia Artificial en el Aula: Oportunidades y Desafíos",
      descripcion: "Exploramos cómo la IA puede transformar la educación y qué consideraciones éticas debemos tener como educadores.",
      categoria: "Tecnología",
      fecha: "28 Septiembre 2025",
      imagen: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop",
      destacado: false
    },
    {
      id: 7,
      titulo: "Actividades para Fomentar la Creatividad en el Aula",
      descripcion: "Ideas prácticas y ejercicios para estimular el pensamiento creativo y la innovación en estudiantes de todas las edades.",
      categoria: "Innovación",
      fecha: "25 Septiembre 2025",
      imagen: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&h=300&fit=crop",
      destacado: false
    },
    {
      id: 8,
      titulo: "Guía Completa: Impresiones Educativas de Calidad",
      descripcion: "Todo lo que necesitas saber sobre formatos, papeles y técnicas de impresión para crear material didáctico profesional.",
      categoria: "Recursos",
      fecha: "20 Septiembre 2025",
      imagen: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&h=300&fit=crop",
      destacado: false
    }
  ];

  const noticiasDestacadas = noticias.filter(n => n.destacado);
  const noticiasRegulares = noticias.filter(n => !n.destacado);

  return (
    <>
      <Header />
      <FilterBar/>
      <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 6 }}>
        <Container maxWidth="lg">
          
          {/* Hero Section */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 6, 
              mb: 5, 
              borderRadius: 3, 
              textAlign: "center", 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
              color: "white" 
            }}
          >
            <BookIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Blog para Docentes
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 700, mx: "auto", lineHeight: 1.8, opacity: 0.95 }}>
              Recursos, consejos e ideas innovadoras para potenciar tu práctica educativa
            </Typography>
          </Paper>

          {/* Noticias Destacadas */}
<Box sx={{ mb: 5 }}>
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, justifyContent: "center" }}>
    <IdeaIcon color="warning" sx={{ fontSize: 30 }} />
    <Typography variant="h4" fontWeight="bold">
      Destacados
    </Typography>
  </Box>
  <Grid container spacing={3} justifyContent="center" width="1000px">
    {noticiasDestacadas.map((noticia) => (
      <Grid item xs={12} md={6} key={noticia.id}>
        <Card 
          elevation={3}
          sx={{ 
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            transition: "all 0.3s",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: 6
            }
          }}
        >
          <CardMedia
            component="img"
            height="250"
            image={noticia.imagen}
            alt={noticia.titulo}
            sx={{ objectFit: "cover" }}
          />
          <CardContent sx={{ p: 3, flexGrow: 1 }}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip 
                  label={noticia.categoria} 
                  color="primary" 
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">
                    {noticia.fecha}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                {noticia.titulo}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {noticia.descripcion}
              </Typography>
            </Stack>
          </CardContent>
          <CardActions sx={{ px: 3, pb: 3 }}>
            <Button 
              endIcon={<ArrowIcon />}
              variant="contained"
              fullWidth
              sx={{ py: 1.2, fontWeight: "bold" }}
            >
              Leer más
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>

          {/* Todas las Noticias */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <ArticleIcon color="primary" sx={{ fontSize: 30 }} />
              <Typography variant="h4" fontWeight="bold">
                Todos los Artículos
              </Typography>
            </Box>
            <Grid container spacing={3} >
              {noticiasRegulares.map((noticia) => (
                <Grid item xs={12} sm={6} md={4} key={noticia.id} width="1000px">
                  <Card 
                    elevation={2}
                    sx={{ 
                      height: "100%",
                      borderRadius: 3,
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={noticia.imagen}
                      alt={noticia.titulo}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      <Stack spacing={1.5}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                          <Chip 
                            label={noticia.categoria} 
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {noticia.fecha}
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                          {noticia.titulo}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          }}
                        >
                          {noticia.descripcion}
                        </Typography>
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ px: 2.5, pb: 2.5 }}>
                      <Button 
                        endIcon={<ArrowIcon />}
                        variant="outlined"
                        fullWidth
                        sx={{ py: 1 }}
                      >
                        Leer más
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          
            </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Docentes;