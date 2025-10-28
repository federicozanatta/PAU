import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/productos?page=${page}&limit=12`)
      .then((response) => {
        setProductos(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener productos:', error);
        setLoading(false);
      });
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ py: 4 }}>
      {loading ? (
        <Typography variant="h6" textAlign="center" sx={{ py: 8 }}>
          Cargando productos...
        </Typography>
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


