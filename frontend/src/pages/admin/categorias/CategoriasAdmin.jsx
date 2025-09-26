import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Pagination, // Se reemplaza TablePagination por Pagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const CategoriasAdmin = () => {
  // ========== ESTADOS DEL COMPONENTE ==========
  const [categorias, setCategorias] = useState([]);
  
  // El estado de la página ahora comienza en 1
  const [page, setPage] = useState(1); 
  
  // Se define un número fijo de filas por página
  const rowsPerPage = 10; 
  
  const [totalItems, setTotalItems] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagenUrl: '',
    activa: true,
  });

  // ========== EFECTOS ==========
  // El efecto ahora solo depende del cambio de página
  useEffect(() => {
    fetchCategorias();
  }, [page]);

  // ========== FUNCIONES DE API ==========
  const fetchCategorias = async () => {
    try {
      // Se ajusta la llamada a la API para que coincida con el estado 'page'
      const response = await axios.get(`http://localhost:3000/api/categorias?page=${page}&limit=${rowsPerPage}&activo=all`);
      setCategorias(response.data.data);
      setTotalItems(response.data.pagination.totalItems);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  // ========== MANEJADORES DE EVENTOS ==========
  // La función se mantiene igual que en el primer componente
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // La función handleChangeRowsPerPage ya no es necesaria y se elimina

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        nombre: category.nombre,
        descripcion: category.descripcion || '',
        imagenUrl: category.imagenUrl || '',
        activa: category.activa,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        nombre: '',
        descripcion: '',
        imagenUrl: '',
        activa: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await axios.put(`http://localhost:3000/api/categorias/${editingCategory.id}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/categorias', formData);
      }
      fetchCategorias();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await axios.delete(`http://localhost:3000/api/categorias/${id}`);
        fetchCategorias();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };


  const totalPages = Math.ceil(totalItems / rowsPerPage);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Categorías
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Agregar Categoría
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell>
                  <Typography variant="subtitle2">{categoria.nombre}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {categoria.descripcion || 'Sin descripción'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {categoria.activa ? 'Activa' : 'Inactiva'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(categoria)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(categoria.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

 
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent>
          {/* ... (contenido del modal sin cambios) ... */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCategory ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriasAdmin;