import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Divider
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/Cart.context';
import { useAuth } from '../contexts/Auth.context';

const CartModal = ({ open, onClose, onOpenLogin }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    addToCart,
    decrementQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart
  } = useCart();

  const handleCheckout = () => {
    onClose();
    if (!isAuthenticated) {
      if (onOpenLogin) onOpenLogin();
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Carrito de Compras</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Tu carrito está vacío
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Agrega algunos productos para comenzar
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Carrito de Compras
          <Button 
            color="error" 
            size="small" 
            onClick={clearCart}
            startIcon={<DeleteIcon />}
          >
            Vaciar
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <List>
          {cartItems.map((item, index) => {
            // Tomar la primera imagen del array o string
            const firstImage = Array.isArray(item.imagenes) 
              ? item.imagenes[0] 
              : item.imagenes;

            return (
              <Box key={item.id}>
                <ListItem>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {/* Imagen del producto */}
                    <Box
                      component="img"
                      src={firstImage ? `http://localhost:3000/uploads/${firstImage}` : '/images/default.png'}
                      alt={item.nombre}
                      sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                      onError={(e) => { e.currentTarget.src = '/images/default.png'; }}
                    />

                    {/* Información del producto */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">{item.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.precio.toFixed(2)} c/u
                      </Typography>
                    </Box>

                    {/* Controles de cantidad */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton size="small" onClick={() => decrementQuantity(item.id)} color="primary">
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="body1" sx={{ minWidth: 20, textAlign: 'center' }}>
                        {item.cantidad}
                      </Typography>
                      <IconButton size="small" onClick={() => addToCart(item)} color="primary">
                        <AddIcon />
                      </IconButton>
                    </Box>

                    {/* Subtotal */}
                    <Box sx={{ ml: 2, minWidth: 80, textAlign: 'right' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        ${(item.precio * item.cantidad).toFixed(2)}
                      </Typography>
                    </Box>

                    {/* Botón eliminar */}
                    <IconButton size="small" onClick={() => removeFromCart(item.id)} color="error" sx={{ ml: 1 }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < cartItems.length - 1 && <Divider />}
              </Box>
            );
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Total */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" fontWeight="bold" color="primary">
            ${getTotalPrice().toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Seguir Comprando</Button>
        <Button variant="contained" color="primary" onClick={handleCheckout}>
          Proceder al Pago
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartModal;
