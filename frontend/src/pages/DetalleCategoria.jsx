import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Paper,
  Pagination,
  Grid
} from "@mui/material";
import {
  Category as CategoryIcon,
  Inventory as ProductIcon
} from "@mui/icons-material";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

function DetalleCategoria() {
  const { id } = useParams();
  const [detalleCategoria, setDetalleCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriaRes, productosRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/categorias/${id}`),
          axios.get(`http://localhost:3000/api/productos?page=${page}&limit=12&idCategoria=${id}`)
        ]);

        setDetalleCategoria(categoriaRes.data.data);
        setProductos(productosRes.data.data);
        setTotalPages(productosRes.data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <>
        <Header />
        <FilterBar />
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
              Cargando productos...
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
      <FilterBar />
      <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 6 }}>
        <Container maxWidth="lg">

          <Paper
            elevation={3}
            sx={{
              p: 5,
              mb: 5,
              borderRadius: 3,
              textAlign: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white"
            }}
          >
            <CategoryIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {detalleCategoria?.nombre}
            </Typography>
            {detalleCategoria?.descripcion && (
              <Typography variant="h6" sx={{ maxWidth: 700, mx: "auto", lineHeight: 1.8, opacity: 0.95 }}>
                {detalleCategoria.descripcion}
              </Typography>
            )}
          </Paper>

          {productos.length === 0 ? (
            <Paper elevation={2} sx={{ p: 6, borderRadius: 3, textAlign: "center" }}>
              <ProductIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No hay productos disponibles en esta categoría
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vuelve más tarde para ver nuevos productos
              </Typography>
            </Paper>
          ) : (
            <>
              <Grid container spacing={3} justifyContent="center">
                {productos.map((producto) => (
                  <Grid item key={producto.id}>
                    <ProductCard producto={producto} />
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}

        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default DetalleCategoria;
