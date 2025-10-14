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
  Pagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const CategoriasAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);

  // Modal
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activa: true,
  });

  // Imagen
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch categorías
  useEffect(() => {
    fetchCategorias();
  }, [page]);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/categorias?page=${page}&limit=${rowsPerPage}&activo=all`
      );
      setCategorias(response.data.data);
      setTotalItems(response.data.pagination.totalItems);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        nombre: category.nombre,
        descripcion: category.descripcion || '',
        activa: category.activa,
      });
      setImagePreview(
        category.imagenUrl
          ? category.imagenUrl.startsWith('http')
            ? category.imagenUrl
            : `http://localhost:3000/uploads/${category.imagenUrl}`
          : null
      );
      setImageFile(null);
    } else {
      setEditingCategory(null);
      setFormData({ nombre: '', descripcion: '', activa: true });
      setImageFile(null);
      setImagePreview(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      const submitData = new FormData();
      submitData.append('nombre', formData.nombre);
      submitData.append('descripcion', formData.descripcion);
      submitData.append('activa', formData.activa);

      if (imageFile) submitData.append('imagen', imageFile);

      if (editingCategory) {
        await axios.put(
          `http://localhost:3000/api/categorias/${editingCategory.id}`,
          submitData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        await axios.post(
          'http://localhost:3000/api/categorias',
          submitData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }

      fetchCategorias();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Categorías</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Agregar Categoría</Button>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.nombre}</TableCell>
                <TableCell>{c.descripcion || 'Sin descripción'}</TableCell>
                <TableCell>{c.activa ? 'Activa' : 'Inactiva'}</TableCell>
                <TableCell>
                  {c.imagenUrl ? (
                    <img
                      src={c.imagenUrl.startsWith('http') ? c.imagenUrl : `http://localhost:3000/uploads/${c.imagenUrl}`}
                      alt={c.nombre}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  ) : 'N/A'}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(c)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDelete(c.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={totalPages} page={page} onChange={handleChangePage} color="primary" showFirstButton showLastButton />
      </Box>

      {/* Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField name="nombre" label="Nombre" value={formData.nombre} onChange={handleInputChange} fullWidth required />
            <TextField name="descripcion" label="Descripción" value={formData.descripcion} onChange={handleInputChange} fullWidth multiline rows={2} />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Imagen de la categoría</Typography>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: 16 }} />
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />}
            </Box>

            <FormControlLabel control={<Switch name="activa" checked={formData.activa} onChange={handleInputChange} />} label="Activa" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">{editingCategory ? 'Actualizar' : 'Crear'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriasAdmin;
