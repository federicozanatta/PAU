import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useAuth } from '../contexts/Auth.context';

const LoginModal = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    tipo: 'cliente'
  });
  const [registerData, setRegisterData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Datos de login:', loginData); // Debug

    const result = await login(loginData.email, loginData.password, loginData.tipo);
    
    if (result.success) {
      onClose();
      // Reset form
      setLoginData({ email: '', password: '', tipo: 'cliente' });
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await register(
      registerData.nombre,
      registerData.email,
      registerData.password,
      registerData.telefono
    );
    
    if (result.success) {
      setSuccess(result.message);
      setRegisterData({ nombre: '', email: '', password: '', telefono: '' });
      // Cambiar a tab de login después de registro exitoso
      setTimeout(() => {
        setTabValue(0);
        setSuccess('');
      }, 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Iniciar Sesión" />
          <Tab label="Registrarse" />
        </Tabs>
      </DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {tabValue === 0 && (
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={loginData.email}
              onChange={handleLoginChange}
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleLoginChange}
              autoComplete="current-password"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de Usuario</InputLabel>
              <Select
                name="tipo"
                value={loginData.tipo}
                onChange={handleLoginChange}
                label="Tipo de Usuario"
              >
                <MenuItem value="cliente">Cliente</MenuItem>
                <MenuItem value="administrador">Administrador</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {tabValue === 1 && (
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nombre"
              name="nombre"
              value={registerData.nombre}
              onChange={handleRegisterChange}
              autoComplete="name"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              autoComplete="email"
            />
            <TextField
              margin="normal"
              fullWidth
              label="Teléfono"
              name="telefono"
              type="tel"
              value={registerData.telefono}
              onChange={handleRegisterChange}
              autoComplete="tel"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              autoComplete="new-password"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={tabValue === 0 ? handleLogin : handleRegister}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Cargando...' : (tabValue === 0 ? 'Iniciar Sesión' : 'Registrarse')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;