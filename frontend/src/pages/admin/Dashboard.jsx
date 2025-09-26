import {
  Box,
  Typography,
  Paper,
} from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Bienvenido al panel de administración de Divino Diseño
      </Typography>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Esta sección estará disponible próximamente
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Aquí se mostrarán estadísticas, gráficos y accesos directos importantes
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;