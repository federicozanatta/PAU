import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { CuponContext } from "../contexts/Cupon.context";
import { useCart } from "../contexts/Cart.context";

const ProductoDetalle = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [variantes, setVariantes] = useState([]);
  const { cupon } = useContext(CuponContext);
  const { addToCart, removeFromCart, isInCart, getItemQuantity } = useCart();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/productos/${id}`)
      .then((res) => setProducto(res.data.data))
      .catch((err) => console.error("Error producto", err));
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/productos/${id}/mensajes`)
      .then((res) => {
        console.log("Mensajes response:", res.data);
        setMensajes(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error mensajes", err);
        setMensajes([]);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/variantes/producto/${id}`)
      .then((res) => {
        console.log("Variantes response:", res.data);
        setVariantes(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error en traer variantes", err);
        setVariantes([]);
      });
  }, [id]);

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;

    axios
      .post(`http://localhost:3000/api/productos/${id}/mensajes`, {
        texto: nuevoMensaje,
      })
      .then((res) => {
        console.log("Mensaje enviado:", res.data);
        setMensajes([...mensajes, res.data.data]);
        setNuevoMensaje("");
      })
      .catch((err) => console.error("Error enviando mensaje", err));
  };

  if (!producto) return <p>Cargando producto...</p>;

  // 👇 calculamos descuentos igual que en ProductCard
  const descuentoProducto = producto.descuento || 0;
  const descuentoCupon = cupon?.porcentajeDescuento || 0;
  const mejorDescuento = Math.max(descuentoProducto, descuentoCupon);
  const precioFinal = producto.precio - (producto.precio * mejorDescuento) / 100;
  const tieneDescuentoAplicado = mejorDescuento > 0;

  const productInCart = isInCart(producto.id);
  const quantity = getItemQuantity(producto.id);

  const handleAddToCart = () => {
    addToCart(producto);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(producto.id);
  };
  return (
    <Box sx={{ p: 3, backgroundColor: "white" }}>
      <Typography variant="h4" gutterBottom>
        {producto.nombre}
      </Typography>

      {/* 👇 mostramos precio con o sin descuento */}
      {tieneDescuentoAplicado ? (
        <>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: "line-through" }}
          >
            ${producto.precio.toFixed(2)}
          </Typography>
          <Typography variant="h5" color="error" fontWeight="bold">
            ${precioFinal.toFixed(2)}
          </Typography>
        </>
      ) : (
        <Typography variant="h5" fontWeight="bold">
          ${producto.precio.toFixed(2)}
        </Typography>
      )}

      {/* Botones de carrito */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddToCart}
          size="large"
        >
          Agregar al carrito
        </Button>
        
        {productInCart && (
          <>
            <Typography variant="body1">
              En carrito: {quantity} unidades
            </Typography>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleRemoveFromCart}
            >
              Eliminar del carrito
            </Button>
          </>
        )}
      </Box>

      {/* Variantes */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Variantes disponibles:</Typography>
        {variantes.length === 0 ? (
          <Typography variant="body2">
            No hay variantes para este producto.
          </Typography>
        ) : (
          <ul>
            {variantes.map((variante) => (
              <li
                key={variante.id}
                style={{
                  color: variante.stock === 0 ? "red" : "black",
                  fontStyle: variante.stock === 0 ? "italic" : "normal",
                }}
              >
                {variante.nombre} | Precio: ${variante.precio} | Stock:{" "}
                {variante.stock} unidades
                {variante.stock === 0 && " (No disponible)"}
              </li>
            ))}
          </ul>
        )}
      </Box>

      {/* Mensajes */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Mensajes del producto:</Typography>
        {mensajes.length === 0 ? (
          <Typography variant="body2">No hay mensajes.</Typography>
        ) : (
          mensajes.map((msg, i) => (
            <Typography key={i} variant="body2" sx={{ my: 1 }}>
              • {msg.texto}
            </Typography>
          ))
        )}
      </Box>

      {/* Formulario mensaje */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1">Escribir un nuevo mensaje:</Typography>
        <TextField
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          fullWidth
          multiline
          rows={2}
          placeholder="Escribe tu mensaje..."
          sx={{ mt: 1 }}
        />
        <Button
          onClick={enviarMensaje}
          variant="contained"
          color="primary"
          sx={{ mt: 1 }}
        >
          Enviar Mensaje
        </Button>
      </Box>
    </Box>
  );
};

export default ProductoDetalle;
