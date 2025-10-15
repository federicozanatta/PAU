import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import { useCart } from '../../contexts/Cart.context';
import axios from 'axios';
import { useAuth } from '../../contexts/Auth.context';

const MERCHANT_INFO = {
  cbu: '0000003100012345678901',
  alias: 'TIENDA.ONLINE',
  titular: 'Tienda Online S.A.'
};

const PaymentScreen = ({ onNext, onBack, shippingData }) => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState({ cbu: false, alias: false });

  const total = getTotalPrice();

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [field]: true });
    setTimeout(() => {
      setCopied({ ...copied, [field]: false });
    }, 2000);
  };

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);
      setError('');

      const clienteResponse = await axios.get(`http://localhost:3000/api/clientes?email=${user.email}`);
      const cliente = clienteResponse.data.data[0];

      const pedidoData = {
        total: total,
        estado: false,
        idCliente: cliente.id
      };

      const pedidoResponse = await axios.post('http://localhost:3000/api/pedidos', pedidoData);
      const pedidoId = pedidoResponse.data.data.id;

      for (const item of cartItems) {
        await axios.post('http://localhost:3000/api/pedidos-productos', {
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          idPedido: pedidoId,
          idProducto: item.id
        });
      }

      const pagoData = {
        monto: total,
        estado: false,
        medio_pago: 'transferencia',
        idPedido: pedidoId
      };

      await axios.post('http://localhost:3000/api/pagos', pagoData);

      clearCart();

      onNext({
        pedidoId,
        total,
        shippingData
      });
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      setError('Error al procesar el pedido. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Información de Pago
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Datos para Transferencia
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                CBU
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  {MERCHANT_INFO.cbu}
                </Typography>
                <Button
                  size="small"
                  startIcon={<CopyIcon />}
                  onClick={() => handleCopy(MERCHANT_INFO.cbu, 'cbu')}
                >
                  {copied.cbu ? 'Copiado!' : 'Copiar'}
                </Button>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Alias
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  {MERCHANT_INFO.alias}
                </Typography>
                <Button
                  size="small"
                  startIcon={<CopyIcon />}
                  onClick={() => handleCopy(MERCHANT_INFO.alias, 'alias')}
                >
                  {copied.alias ? 'Copiado!' : 'Copiar'}
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Titular
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {MERCHANT_INFO.titular}
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              Por favor realice la transferencia por el monto exacto de ${total.toFixed(2)}.
              Una vez confirmado el pago, procesaremos su pedido.
            </Alert>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resumen del Pedido
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List dense>
              {cartItems.map((item) => (
                <ListItem key={item.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={item.nombre}
                    secondary={`${item.cantidad} x $${item.precio.toFixed(2)}`}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    ${(item.cantidad * item.precio).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                ${total.toFixed(2)}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Dirección de envío:
            </Typography>
            <Typography variant="body2">
              {shippingData?.calle} {shippingData?.numeracion}, {shippingData?.ciudad}, {shippingData?.provincia}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onBack} disabled={loading}>
          Volver
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmPayment}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Confirmar Pedido'}
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentScreen;
