import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Autocomplete,
  Box,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const menuItems = [
  { label: "Categorías", path: "/categorias" },
  { label: "Nosotros", path: "/nosotros" },
  { label: "Contacto", path: "/contacto" },
  { label: "Docentes", path: "/docentes" }
];

const FilterBar = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
  axios
    .get("http://localhost:3000/api/productos")
    .then((res) => {
      setProductos(res.data.data); 
    })
    .catch((err) => {
      console.error("Error al traer productos:", err);
    });
}, []);

  return (
    <Box
        sx={{
    display: "flex",
    justifyContent: "center", // centra los botones
    alignItems: "center",
    width: "100%",             // 🔹 ocupa el 90% del ancho total
    mx: "auto",               // 🔹 centra horizontalmente el Box
    gap: 5,                   // 🔹 separación entre botones
    backgroundColor: "info.main", // color de fondo
    py: 1,                    // 🔹 padding vertical para que se vea más alto
            
  }}
>
  {menuItems.map((item, i) => (
    <Button
      key={i}
      variant="text"
      color="secondary"
      sx={{ 
        minWidth: 80,          // 🔹 botones un poco más anchos
        fontSize: "1rem",      // 🔹 texto más grande
        fontWeight: "bold",    // 🔹 texto más visible
      }}
      component={Link}
      to={item.path}
    >
      {item.label}
    </Button>
  ))}

      <Autocomplete
        options={productos}
        getOptionLabel={(option) => option.nombre || ""}
        onChange={(e, nuevoValor) => setProductoSeleccionado(nuevoValor)}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Buscar producto" size="small" />
        )}
      />

      {productoSeleccionado && (
        <Typography sx={{ ml: 2 }}>
          Producto seleccionado: {productoSeleccionado.nombre}
        </Typography>
      )}
    </Box>
  );
};

export default FilterBar;