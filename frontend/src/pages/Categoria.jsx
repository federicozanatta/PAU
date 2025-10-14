import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []); // <-- vacío: solo se ejecuta una vez al montar

  if (loading) {
    return <Typography>Cargando categorías...</Typography>;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 3,
        p: 3,
      }}
    >
      {categorias.length === 0 ? (
        <Typography>No hay categorías para mostrar</Typography>
      ) : (
        categorias.map((categoria) => (
          <Card key={categoria.id} sx={{ maxWidth: 250, margin: "auto" }}>
            {categoria.imagenUrl && (
              <CardMedia
  component="img"
  height="150"
  image={categoria.imagenUrl.startsWith('http') 
          ? categoria.imagenUrl 
          : `http://localhost:3000/uploads/${categoria.imagenUrl}`} // <-- aquí
  alt={categoria.nombre}
  sx={{ objectFit: "cover" }}
/>

            )}
            <CardContent>
              <Typography variant="h6" align="center">
                {categoria.nombre}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

export default Categoria;
