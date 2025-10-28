import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Drawer,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import Header from "../components/Header";
import Banner from "../components/Banner";
import FilterBar from "../components/FilterBar";
import ProductList from "../components/ProductList";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Cupon from "../components/Cupon";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);

  const [filters, setFilters] = useState({
    nombre: "",
    precioMin: "",
    precioMax: "",
    idCategoria: ""
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/categorias?page=1&limit=50&activo=all");
        setCategorias(response.data.data);
      } catch (error) {
        console.error("Error fetching categorias:", error);
      }
    };
    fetchCategorias();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      nombre: "",
      precioMin: "",
      precioMax: "",
      idCategoria: ""
    });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ width: 280, p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FilterIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" fontWeight="bold">
            Filtros
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <TextField
        fullWidth
        label="Buscar producto"
        variant="outlined"
        size="small"
        value={filters.nombre}
        onChange={(e) => handleFilterChange("nombre", e.target.value)}
        placeholder="Ej: Cuaderno"
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        Rango de Precio
      </Typography>
      <TextField
        fullWidth
        label="Precio mínimo"
        variant="outlined"
        size="small"
        type="number"
        value={filters.precioMin}
        onChange={(e) => handleFilterChange("precioMin", e.target.value)}
        placeholder="$0"
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Precio máximo"
        variant="outlined"
        size="small"
        type="number"
        value={filters.precioMax}
        onChange={(e) => handleFilterChange("precioMax", e.target.value)}
        placeholder="$10000"
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        Categorías
      </Typography>
      <List sx={{ mb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected={filters.idCategoria === ""}
            onClick={() => handleFilterChange("idCategoria", "")}
          >
            <ListItemText primary="Todas" />
          </ListItemButton>
        </ListItem>
        {categorias.map((categoria) => (
          <ListItem key={categoria.id} disablePadding>
            <ListItemButton
              selected={filters.idCategoria === categoria.id.toString()}
              onClick={() => handleFilterChange("idCategoria", categoria.id.toString())}
            >
              <ListItemText primary={categoria.nombre} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClearFilters}
        fullWidth
      >
        Limpiar Filtros
      </Button>
    </Box>
  );

  return (
    <>
      <Header />
      <FilterBar />
      <Banner />
      <Cupon />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {isMobile ? (
            <>
              <Button
                variant="contained"
                startIcon={<FilterIcon />}
                onClick={handleDrawerToggle}
                sx={{ mb: 2 }}
              >
                Filtros
              </Button>
              <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
              >
                {drawerContent}
              </Drawer>
            </>
          ) : (
            <Box sx={{ flexShrink: 0 }}>
              <Card elevation={2} sx={{ position: 'sticky', top: 80 }}>
                {drawerContent}
              </Card>
            </Box>
          )}

          <Box sx={{ flex: 1 }}>
            <ProductList filters={filters} />
          </Box>
        </Box>
      </Container>

      <Hero />
      <Footer />
    </>
  );
};

export default Home;
