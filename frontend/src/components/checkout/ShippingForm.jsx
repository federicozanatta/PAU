// src/components/checkout/ShippingForm.jsx
import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const ShippingForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    calle: '',
    numeracion: '',
    ciudad: '',
    provincia: '',
    codigo_postal: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData); // envía los datos al Checkout
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" gutterBottom>Dirección de Envío</Typography>
      <TextField label="Calle" name="calle" value={formData.calle} onChange={handleChange} required />
      <TextField label="Número" name="numeracion" value={formData.numeracion} onChange={handleChange} required />
      <TextField label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
      <TextField label="Provincia" name="provincia" value={formData.provincia} onChange={handleChange} required />
      <TextField label="Código Postal" name="codigo_postal" value={formData.codigo_postal} onChange={handleChange} required />
      <Button type="submit" variant="contained">Continuar</Button>
    </Box>
  );
};

export default ShippingForm;
