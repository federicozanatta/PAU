import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = ({ orderData }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />

      <Typography variant="h4" gutterBottom>
        ¡Pedido Confirmado!
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
        Número de Pedido: #{orderData?.pedidoId}
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3, maxWidth: 600, mx: 'auto' }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Hemos registrado tu pedido correctamente. Una vez que confirmemos el pago,
          procesaremos tu orden y te enviaremos la información de seguimiento.
        </Alert>

        <Box sx={{ textAlign: 'left', mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Total pagado:
          </Typography>
          <Typography variant="h5" color="primary" fontWeight="bold">
            ${orderData?.total?.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Dirección de envío:
          </Typography>
          <Typography variant="body1">
            {orderData?.shippingData?.calle} {orderData?.shippingData?.numeracion}
          </Typography>
          <Typography variant="body1">
            {orderData?.shippingData?.ciudad}, {orderData?.shippingData?.provincia}
          </Typography>
          {orderData?.shippingData?.codigo_postal && (
            <Typography variant="body1">
              CP: {orderData.shippingData.codigo_postal}
            </Typography>
          )}
        </Box>
      </Paper>

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/')}
      >
        Volver al Inicio
      </Button>
    </Box>
  );
};

export default OrderConfirmation;
