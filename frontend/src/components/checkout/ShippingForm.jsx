import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Stepper, Step, StepLabel, Box, Paper } from '@mui/material';
import { useAuth } from '../contexts/Auth.context';
import { useCart } from '../contexts/Cart.context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentScreen from '../components/checkout/PaymentScreen';
import OrderConfirmation from '../components/checkout/OrderConfirmation';

const steps = ['Dirección de Envío', 'Pago', 'Confirmación'];

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState(null);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { state: { openLogin: true } });
    }

    if (cartItems.length === 0 && activeStep === 0) {
      navigate('/');
    }
  }, [isAuthenticated, cartItems, activeStep, navigate]);

  const handleNext = (data) => {
    if (activeStep === 0) {
      setShippingData(data);
    } else if (activeStep === 1) {
      setOrderData(data);
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ShippingForm onNext={handleNext} />;
      case 1:
        return <PaymentScreen onNext={handleNext} onBack={handleBack} shippingData={shippingData} />;
      case 2:
        return <OrderConfirmation orderData={orderData} />;
      default:
        return 'Paso desconocido';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {getStepContent(activeStep)}
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default Checkout;
