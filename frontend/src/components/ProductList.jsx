import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Inventory as ProductIcon } from '@mui/icons-material';

const ProductList = ({ filters = {} }) => {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "12"
        });

        if (filters.nombre) params.append("nombre", filters.nombre);
        if (filters.precioMin) params.append("precioMin", filters.precioMin);
        if (filters.precioMax) params.append("precioMax", filters.precioMax);
        if (filters.idCategoria) params.append("idCategoria", filters.idCategoria);

        const response = await axios.get(`http://localhost:3000/api/productos?${params.toString()}`);
        setProductos(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [page, filters]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      {loading ? (
        <Typography variant="h6" textAlign="center" sx={{ py: 8 }}>
          Cargando productos...
        </Typography>
      ) : productos.length === 0 ? (
        <Paper elevation={2} sx={{ p: 6, borderRadius: 3, textAlign: "center" }}>
          <ProductIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No se encontraron productos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Intenta ajustar los filtros para ver más resultados
          </Typography>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            {productos.map((producto) => {
              return <ProductCard key={producto.id} producto={producto} />;
            })}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
    </Box>
  );
};

export default ProductList;


