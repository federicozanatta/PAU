import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Box from '@mui/material/Box';

const ProductList = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/productos')
      .then((response) => {
        setProductos(response.data.data); 
      })
      .catch((error) => {
        console.error('Error al obtener productos:', error);
      });
  }, []);

  
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
  {productos.map((producto) => {
    
    return <ProductCard key={producto.id} producto={producto} />;
  })}
</Box>

  );
};

export default ProductList;


