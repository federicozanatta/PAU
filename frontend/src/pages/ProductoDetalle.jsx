import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardMedia,
  IconButton,
  Container,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon
} from "@mui/icons-material";
import { CuponContext } from "../contexts/Cupon.context";
import { useCart } from "../contexts/Cart.context";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProductoDetalle = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [variantes, setVariantes] = useState([]);
  const { cupon } = useContext(CuponContext);
  const { addToCart, removeFromCart, isInCart, getItemQuantity } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/productos/${id}`)
      .then((res) => setProducto(res.data.data))
      .catch((err) => console.error("Error producto", err));
  }, [id]);

  useEffect(() => {
    if (producto?.imagen) {
      // Por ahora solo una imagen, pero preparado para múltiples
      setImages([`http://localhost:3000/uploads/${producto.imagen}`]);
    } else {
      setImages(['https://via.placeholder.com/500x400?text=Sin+Imagen']);
    }
  }, [producto]);

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleQuantityChange = (action) => {
    if (action === 'increment') {
      addToCart(producto);
    } else if (action === 'decrement' && quantity > 0) {
      if (quantity === 1) {
        removeFromCart(producto.id);
      } else {
        // Aquí necesitarías una función decrementQuantity en el contexto
        // Por ahora usamos removeFromCart que elimina completamente
        removeFromCart(producto.id);
        // Agregar la cantidad - 1
        for (let i = 0; i < quantity - 1; i++) {
          addToCart(producto);
        }
      }
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4, backgroundColor: "white", minHeight: "100vh" }}>
        <Grid container spacing={4}>
          {/* Columna izquierda - Carrusel de imágenes */}
          <Grid item xs={12} md={6}>
            <Card sx={{ position: 'relative', mb: 2 }}>
              <CardMedia
                component="img"
                height="400"
                image={images[currentImageIndex]}
                alt={producto?.nombre}
                sx={{ objectFit: 'cover' }}
              />
              
              {/* Controles del carrusel */}
              {images.length > 1 && (
                <>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                    }}
                    onClick={prevImage}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                    }}
                    onClick={nextImage}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </>
              )}
              
              {/* Indicadores */}
              {images.length > 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1
                  }}
                >
                  {images.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </Box>
              )}
            </Card>
          </Grid>

          {/* Columna derecha - Información del producto */}
          <Grid item xs={12} md={6}>
            <Box sx={{ pl: { md: 2 } }}>
              {/* Nombre del producto */}
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                {producto?.nombre}
              </Typography>

              {/* Descripción */}
              <Typography variant="body1" color="text.secondary" paragraph>
                {producto?.descripcion}
              </Typography>

              {/* Precio */}
              <Box sx={{ mb: 3 }}>
                {tieneDescuentoAplicado ? (
                  <>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ textDecoration: "line-through" }}
                    >
                      ${producto?.precio.toFixed(2)}
                    </Typography>
                    <Typography variant="h4" color="error" fontWeight="bold">
                      ${precioFinal.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      ¡Ahorrás ${(producto?.precio - precioFinal).toFixed(2)}!
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    ${producto?.precio.toFixed(2)}
                  </Typography>
                )}
              </Box>

              {/* Stock disponible */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Stock disponible: {producto?.stock} unidades
              </Typography>

              {/* Controles de cantidad y carrito */}
              <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" gutterBottom>
                  Cantidad
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <IconButton 
                    onClick={() => handleQuantityChange('decrement')}
                    disabled={quantity === 0}
                    color="primary"
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'primary.main',
                      '&:disabled': { borderColor: 'grey.300' }
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  
                  <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  
                  <IconButton 
                    onClick={() => handleQuantityChange('increment')}
                    color="primary"
                    disabled={quantity >= (producto?.stock || 0)}
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'primary.main',
                      '&:disabled': { borderColor: 'grey.300' }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                {quantity > 0 && (
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    Subtotal: ${(precioFinal * quantity).toFixed(2)}
                  </Typography>
                )}
              </Paper>

              {/* Botón principal de carrito */}
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAddToCart}
                size="large"
                fullWidth
                sx={{ mb: 2, py: 1.5 }}
              >
                {productInCart ? 'Agregar más al carrito' : 'Agregar al carrito'}
              </Button>

              {productInCart && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleRemoveFromCart}
                  size="large"
                  fullWidth
                >
                  Eliminar del carrito
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Sección de variantes */}
        {variantes.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Variantes disponibles
            </Typography>
            <Grid container spacing={2}>
              {variantes.map((variante) => (
                <Grid item xs={12} sm={6} md={4} key={variante.id}>
                  <Card sx={{ p: 2, opacity: variante.stock === 0 ? 0.5 : 1 }}>
                    <Typography variant="h6">{variante.nombre}</Typography>
                    <Typography variant="body1" color="primary" fontWeight="bold">
                      ${variante.precio}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={variante.stock === 0 ? "error" : "text.secondary"}
                    >
                      Stock: {variante.stock} unidades
                      {variante.stock === 0 && " (No disponible)"}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Sección de mensajes */}
        <Box>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Comentarios del producto
          </Typography>
          
          {/* Formulario para nuevo mensaje */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Escribir un comentario
            </Typography>
            <TextField
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Comparte tu opinión sobre este producto..."
              sx={{ mb: 2 }}
            />
            <Button
              onClick={enviarMensaje}
              variant="contained"
              color="primary"
              disabled={!nuevoMensaje.trim()}
            >
              Enviar Comentario
            </Button>
          </Paper>

          {/* Lista de mensajes */}
          <Paper sx={{ p: 2 }}>
            {mensajes.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                No hay comentarios aún. ¡Sé el primero en comentar!
              </Typography>
            ) : (
              <List>
                {mensajes.map((msg, i) => (
                  <ListItem key={i} divider={i < mensajes.length - 1}>
                    <ListItemText
                      primary={msg.texto}
                      secondary="Usuario anónimo" // Podrías agregar fecha/usuario aquí
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default ProductoDetalle;
