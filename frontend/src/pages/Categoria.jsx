import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent,
  Container,
  Paper,
  Grid,
  CircularProgress,
  Chip
} from "@mui/material";
import { 
  Category as CategoryIcon,
  Inventory as ProductIcon
} from "@mui/icons-material";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import Footer from "../components/Footer";


function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/categorias?page=1&limit=10&activo=all");
        setCategorias(response.data.data);
      } catch (error) {
        console.error("Error fetching categorias:", error);
      } finally {
        setLoading(false);
      }
    };
    getCategorias();
  }, []);

  const handleCategoriaClick = (categoriaId) => {
    navigate(`/categorias/${categoriaId}`);
  };

  if (loading) {
    return (
      <>
        <Header />
        <FilterBar/>
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "100vh",
          backgroundColor: "#f8f9fa"
        }}>
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
              Cargando categorías...
            </Typography>
          </Box>
        </Box>
        <Footer />
      </>
    );
  }

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
            <CategoryIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Nuestras Categorías
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 700, mx: "auto", lineHeight: 1.8, opacity: 0.95 }}>
              Explora nuestra amplia variedad de productos organizados por categoría
            </Typography>
          </Paper>

          {/* Categorías */}
          {categorias.length === 0 ? (
            <Paper elevation={2} sx={{ p: 6, borderRadius: 3, textAlign: "center",   }}>
              <ProductIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No hay categorías disponibles
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vuelve más tarde para ver nuestras categorías
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {categorias.map((categoria) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={categoria.id} width= "350px">
                  <Card 
                    elevation={2}
                    onClick={() => handleCategoriaClick(categoria.id)}
                    sx={{ 
                      height: "100%",
                      borderRadius: 3,
                      cursor: "pointer",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-12px)",
                        boxShadow: 6
                      }
                    }}
                  >
                    {categoria.imagenUrl ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={categoria.imagenUrl.startsWith('http') 
                                ? categoria.imagenUrl 
                                : `http://localhost:3000/uploads/${categoria.imagenUrl}`}
                        alt={categoria.nombre}
                        sx={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#e0e0e0"
                        }}
                      >
                        <CategoryIcon sx={{ fontSize: 80, color: "text.secondary" }} />
                      </Box>
                    )}
                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                      <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                        {categoria.nombre}
                      </Typography>
                      {categoria.descripcion && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: 1
                          }}
                        >
                          {categoria.descripcion}
                        </Typography>
                      )}
                      <Chip 
                        label="Ver productos" 
                        color="primary" 
                        size="small"
                        sx={{ mt: 1, fontWeight: "bold" }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Call to Action */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 5, 
              mt: 5, 
              borderRadius: 3, 
              textAlign: "center",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white"
            }}
          >
            <ProductIcon sx={{ fontSize: 50, mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              ¿No encuentras lo que buscas?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.95 }}>
              Contáctanos y te ayudaremos a encontrar el producto perfecto para ti
            </Typography>
          </Paper>

        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default Categoria;
