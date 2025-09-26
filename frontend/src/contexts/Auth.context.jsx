import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Aquí podrías verificar si el token es válido
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password, tipo = 'cliente') => {
    try {
      console.log('Intentando login:', { email, tipo }); // Debug
      
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
        tipo
      });

      console.log('Respuesta del servidor:', response.data); // Debug

      const { accessToken } = response.data.data;
      
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Aquí podrías obtener los datos del usuario si es necesario
      setUser({ email, tipo });
      
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  };

  const register = async (nombre, email, password, telefono) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        nombre,
        email,
        password,
        telefono
      });

      return { success: true, message: 'Usuario registrado exitosamente' };
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al registrar usuario' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};