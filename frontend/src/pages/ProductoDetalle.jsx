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
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Inventory as StockIcon,
} from "@mui/icons-material";
import { CuponContext } from "../contexts/Cupon.context";
import { useCart } from "../contexts/Cart.context";
import Header from "../components/Header";
import Footer from "../components/Footer";
import socketService from "../services/socket.service";

const ProductoDetalle = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [variantes, setVariantes] = useState([]);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(0);

  const { cupon } = useContext(CuponContext);
  const { removeFromCart, isInCart, getItemQuantity, setProductQuantity } =
    useCart();

  const cartQuantity = producto ? getItemQuantity(producto.id) : 0;
  const productInCart = producto ? isInCart(producto.id) : false;

  // 🔹 Cargar producto
  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:3000/api/productos/${id}`)
      .then((res) => setProducto(res.data.data))
      .catch((err) => console.error("Error producto", err));
  }, [id]);

  // 🔹 Cargar imágenes
  useEffect(() => {
    if (!producto) return;

    let imagenes = [];
    if (producto.imagenes) {
      try {
        imagenes =
          typeof producto.imagenes === "string"
            ? JSON.parse(producto.imagenes)
            : producto.imagenes;
      } catch (error) {
        console.warn("Error parseando imágenes:", error);
      }
    } else if (producto.imagen) {
      imagenes = [producto.imagen];
    }

    setImages(
      imagenes.length
        ? imagenes.map((img) =>
            img.startsWith("http")
              ? img
              : `http://localhost:3000/uploads/${img}`
          )
        : ["https://placehold.co/500x400?text=Sin+Imagen"]
    );
    setCurrentImageIndex(0);
  }, [producto]);

  // 🔹 Cargar mensajes
  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:3000/api/productos/${id}/mensajes`)
      .then((res) => setMensajes(res.data.data || []))
      .catch((err) => {
        console.error("Error mensajes", err);
        setMensajes([]);
      });
  }, [id]);

  // 🔹 Cargar variantes
  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:3000/api/variantes/producto/${id}`)
      .then((res) => setVariantes(res.data.data || []))
      .catch((err) => {
        console.error("Error variantes", err);
        setVariantes([]);
      });
  }, [id]);

  // 🔹 Socket de comentarios
  useEffect(() => {
    if (!id) return;
    const socket = socketService.connect();
    if (!socket) return;

    setIsConnected(true);
    socketService.joinProduct(id);

    socketService.onCommentAdded(({ data }) => {
      setMensajes((prev) => [...prev, data]);
    });

    socketService.onCommentError(console.error);

    return () => {
      socketService.leaveProduct(id);
      socketService.offCommentAdded();
      socketService.offCommentError();
      socketService.disconnect();
      setIsConnected(false);
    };
  }, [id]);

  // 🔹 Enviar mensaje
  const enviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;
    socketService.sendComment(id, nuevoMensaje);
    setNuevoMensaje("");
  };

  // 🔹 Manejo de cantidad seleccionada
  const handleQuantityChange = (action) => {
    if (action === "increment") {
      setSelectedQuantity((prev) => Math.min(prev + 1, producto?.stock || 0));
    } else if (action === "decrement") {
      setSelectedQuantity((prev) => Math.max(prev - 1, 0));
    }
  };

  // 🔹 Agregar al carrito
  const handleAddToCart = () => {
    if (selectedQuantity > 0) {
      setProductQuantity(producto, cartQuantity + selectedQuantity);
      setSelectedQuantity(0);
    }
  };

  // 🔹 Quitar del carrito
  const handleRemoveFromCart = () => {
    removeFromCart(producto.id);
    setSelectedQuantity(0);
  };

  // 🔹 Carrusel de imágenes
  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  if (!producto) return <p>Cargando producto...</p>;

  // 🔹 Cálculo de descuentos
  const descuentoProducto = producto.descuento || 0;
  const descuentoCupon = cupon?.porcentajeDescuento || 0;
  const mejorDescuento = Math.max(descuentoProducto, descuentoCupon);
  const precioFinal =
    producto.precio - (producto.precio * mejorDescuento) / 100;
  const tieneDescuentoAplicado = mejorDescuento > 0;

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="xl">
          {/* Imagen del producto */}
          <Paper elevation={2} sx={{ p: 4, mb: 3, borderRadius: 3 }}>
            <Box sx={{ maxWidth: 600, mx: "auto" }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={images[currentImageIndex]}
                    alt={producto.nombre}
                    sx={{
                      objectFit: "contain",
                      width: "100%",
                      height: "auto",
                      maxHeight: "500px",
                      backgroundColor: "#f5f5f5",
                    }}
                  />

                  {/* Descuento badge */}
                  {mejorDescuento > 0 && (
                    <Chip
                      label={`-${mejorDescuento}%`}
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        fontWeight: "bold",
                        fontSize: "1rem",
                        height: 36,
                      }}
                    />
                  )}

                  {images.length > 1 && (
                    <>
                      <IconButton
                        sx={{
                          position: "absolute",
                          left: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(255,255,255,0.95)",
                          boxShadow: 2,
                          "&:hover": { backgroundColor: "white" },
                        }}
                        onClick={prevImage}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                      <IconButton
                        sx={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(255,255,255,0.95)",
                          boxShadow: 2,
                          "&:hover": { backgroundColor: "white" },
                        }}
                        onClick={nextImage}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </>
                  )}
                </Box>

                {/* Miniaturas */}
                {images.length > 1 && (
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      gap: 1,
                      overflowX: "auto",
                      justifyContent: "center",
                    }}
                  >
                    {images.map((img, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={img}
                        alt={`${producto.nombre} ${index + 1}`}
                        onClick={() => setCurrentImageIndex(index)}
                        sx={{
                          width: 70,
                          height: 70,
                          objectFit: "cover",
                          borderRadius: 1,
                          cursor: "pointer",
                          border:
                            index === currentImageIndex
                              ? "3px solid"
                              : "1px solid",
                          borderColor:
                            index === currentImageIndex
                              ? "primary.main"
                              : "#e0e0e0",
                          opacity: index === currentImageIndex ? 1 : 0.6,
                          transition: "all 0.2s",
                          flexShrink: 0,
                          "&:hover": { opacity: 1 },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Card>
            </Box>
          </Paper>

          {/* Información del producto */}
          <Paper elevation={2} sx={{ p: 4, mb: 3, borderRadius: 3 }}>
            <Box sx={{ maxWidth: 800, mx: "auto" }}>
              <Stack spacing={3}>
                {/* Nombre */}
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="text.primary"
                  textAlign="center"
                >
                  {producto.nombre}
                </Typography>

                {/* Descripción */}
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.8, textAlign: "center" }}
                >
                  {producto.descripcion}
                </Typography>

                <Divider />

                {/* Precio */}
                <Box sx={{ textAlign: "center" }}>
                  {tieneDescuentoAplicado ? (
                    <Stack spacing={1} alignItems="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="h5"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          ${producto.precio.toFixed(2)}
                        </Typography>
                        <Chip
                          label={`${mejorDescuento}% OFF`}
                          color="success"
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      </Box>
                      <Typography
                        variant="h3"
                        color="error.main"
                        fontWeight="bold"
                      >
                        ${precioFinal.toFixed(2)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="success.main"
                        fontWeight="medium"
                      >
                        ¡Ahorrás ${(producto.precio - precioFinal).toFixed(2)}!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      ${producto.precio.toFixed(2)}
                    </Typography>
                  )}
                </Box>

                <Divider />

                {/* Stock y envío */}
                <Stack
                  direction="row"
                  spacing={3}
                  justifyContent="center"
                  flexWrap="wrap"
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <StockIcon
                      color={producto.stock > 0 ? "success" : "error"}
                    />
                    <Typography variant="body2" color="text.secondary">
                      <strong>{producto.stock}</strong> unidades disponibles
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ShippingIcon color="primary" />
                    <Typography variant="body2" color="primary">
                      Envío disponible
                    </Typography>
                  </Box>
                </Stack>

                <Divider />

                {/* Selector de cantidad */}
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight="medium"
                    gutterBottom
                    textAlign="center"
                  >
                    Cantidad
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "2px solid #e0e0e0",
                      backgroundColor: "#fafafa",
                      maxWidth: 400,
                      mx: "auto",
                    }}
                  >
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 3,
                        }}
                      >
                        <IconButton
                          onClick={() => handleQuantityChange("decrement")}
                          disabled={selectedQuantity === 0}
                          color="primary"
                          size="large"
                          sx={{
                            border: "2px solid",
                            borderColor:
                              selectedQuantity === 0
                                ? "#e0e0e0"
                                : "primary.main",
                            "&:hover": { transform: "scale(1.1)" },
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>

                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          sx={{ minWidth: 60, textAlign: "center" }}
                        >
                          {selectedQuantity}
                        </Typography>

                        <IconButton
                          onClick={() => handleQuantityChange("increment")}
                          disabled={selectedQuantity >= (producto.stock || 0)}
                          color="primary"
                          size="large"
                          sx={{
                            border: "2px solid",
                            borderColor:
                              selectedQuantity >= producto.stock
                                ? "#e0e0e0"
                                : "primary.main",
                            "&:hover": { transform: "scale(1.1)" },
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>

                      {selectedQuantity > 0 && (
                        <Box
                          sx={{
                            textAlign: "center",
                            p: 1.5,
                            backgroundColor: "success.light",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            color="success.dark"
                            fontWeight="bold"
                          >
                            Subtotal: $
                            {(precioFinal * selectedQuantity).toFixed(2)}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                </Box>

                {/* Botones de acción */}
                <Stack spacing={2} alignItems="center">
                  <Button
                    onClick={handleAddToCart}
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={selectedQuantity === 0}
                    startIcon={<CartIcon />}
                    sx={{
                      py: 1.8,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      boxShadow: 3,
                      maxWidth: 500,
                      width: "100%",
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    Añadir al carrito
                  </Button>

                  {productInCart && (
                    <Button
                      onClick={handleRemoveFromCart}
                      variant="outlined"
                      color="error"
                      size="large"
                      sx={{
                        py: 1.5,
                        maxWidth: 500,
                        width: "100%",
                      }}
                    >
                      Eliminar del carrito
                    </Button>
                  )}
                </Stack>

                {/* Info del carrito */}
                <Stack spacing={2} alignItems="center">
                  {cartQuantity > 0 && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        backgroundColor: "info.light",
                        borderRadius: 2,
                        maxWidth: 500,
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="info.dark"
                        textAlign="center"
                      >
                        Ya tienes <strong>{cartQuantity}</strong>{" "}
                        {cartQuantity === 1 ? "unidad" : "unidades"} en el
                        carrito
                      </Typography>
                    </Paper>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Paper>

          {/* Variantes */}
          {variantes.length > 0 && (
            <Paper elevation={2} sx={{ p: 4, mb: 3, borderRadius: 3 }}>
              <Box sx={{ maxWidth: 900, mx: "auto" }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  fontWeight="bold"
                  sx={{ mb: 3, textAlign: "center" }}
                >
                  Variantes disponibles
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  {variantes.map((variante) => (
                    <Grid item xs={12} sm={6} md={4} key={variante.id}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 2.5,
                          border: "1px solid #e0e0e0",
                          opacity: variante.stock === 0 ? 0.5 : 1,
                          transition: "all 0.2s",
                          "&:hover": {
                            boxShadow: 3,
                            transform:
                              variante.stock > 0 ? "translateY(-4px)" : "none",
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="medium"
                          gutterBottom
                        >
                          {variante.nombre}
                        </Typography>
                        <Typography
                          variant="h5"
                          color="primary"
                          fontWeight="bold"
                          sx={{ mb: 1 }}
                        >
                          ${variante.precio}
                        </Typography>
                        <Chip
                          label={
                            variante.stock === 0
                              ? "Sin stock"
                              : `${variante.stock} disponibles`
                          }
                          color={variante.stock === 0 ? "error" : "success"}
                          size="small"
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          )}

          {/* Comentarios */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ maxWidth: 900, mx: "auto" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  Comentarios del producto ({mensajes.length})
                </Typography>
                <Chip
                  label={isConnected ? "En vivo" : "Desconectado"}
                  color={isConnected ? "success" : "error"}
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>

              {/* Formulario de comentario */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#fafafa",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Escribir un comentario
                </Typography>
                <TextField
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Comparte tu opinión sobre este producto..."
                  sx={{
                    mb: 2,
                    backgroundColor: "white",
                    borderRadius: 1,
                  }}
                />
                <Button
                  onClick={enviarMensaje}
                  variant="contained"
                  color="primary"
                  disabled={!nuevoMensaje.trim()}
                  size="large"
                  sx={{ fontWeight: "bold" }}
                >
                  Publicar Comentario
                </Button>
              </Paper>

              {/* Lista de comentarios */}
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                {mensajes.length === 0 ? (
                  <Box sx={{ p: 6, textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No hay comentarios aún
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ¡Sé el primero en compartir tu opinión!
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {mensajes.map((msg, i) => (
                      <ListItem
                        key={i}
                        divider={i < mensajes.length - 1}
                        sx={{
                          py: 2.5,
                          px: 3,
                          "&:hover": { backgroundColor: "#fafafa" },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ mb: 0.5 }}>
                              {msg.texto}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Usuario anónimo
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};
export default ProductoDetalle;
