import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/Auth.context';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    const error = params.get('error');

    if (error) {
      console.error('Error en autenticación:', error);
      navigate('/?error=auth_failed');
      return;
    }

    if (token) {
      handleGoogleCallback(token, refreshToken);
      navigate('/');
    } else {
      navigate('/?error=no_token');
    }
  }, [navigate, handleGoogleCallback]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Iniciando sesión...
      </Typography>
    </Box>
  );
};

export default AuthCallback;
