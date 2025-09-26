import { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Pagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";

const ProductosAdmin = () => {
  // Estado para almacenar la lista de productos
  const [productos, setProductos] = useState([]);

  // Estado para almacenar la lista de categorías
  const [categorias, setCategorias] = useState([]);

  // Estado para controlar la página actual
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  const [totalItems, setTotalItems] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    stock: "",
    oferta: false,
    descuento: 0,
    idCategoria: "",
    idAdministrador: 1, // Valor fijo por ahora
  });

  // Estado para manejar el archivo de imagen
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // useEffect que se ejecuta cuando cambia la página

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, [page]);

  const fetchProductos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/productos?page=${page}&limit=${rowsPerPage}`
      );

      setProductos(response.data.data);
      setTotalItems(response.data.pagination.totalItems);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categorias");
      setCategorias(response.data.data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        precio: product.precio,
        descripcion: product.descripcion,
        stock: product.stock,
        oferta: product.oferta,
        descuento: product.descuento,
        idCategoria: product.idCategoria,
        idAdministrador: product.idAdministrador,
      });
      // Mostrar imagen actual si existe
      if (product.imagen) {
        setImagePreview(`http://localhost:3000/uploads/${product.imagen}`);
      }
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: "",
        precio: "",
        descripcion: "",
        stock: "",
        oferta: false,
        descuento: 0,
        idCategoria: "",
        idAdministrador: 1,
      });
      setImageFile(null);
      setImagePreview(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Manejar cambio de archivo de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      // Crear FormData para enviar archivo
      const submitData = new FormData();
      
      // Agregar todos los campos del formulario
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Agregar imagen si se seleccionó una
      if (imageFile) {
        submitData.append('imagen', imageFile);
      }

      if (editingProduct) {
        await axios.put(
          `http://localhost:3000/api/productos/${editingProduct.id}`,
          submitData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        await axios.post("http://localhost:3000/api/productos", submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      fetchProductos();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  /**
   * Función para eliminar un producto
  
   */
  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      try {
        await axios.delete(`http://localhost:3000/api/productos/${id}`);
        fetchProductos();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const totalPages = Math.ceil(totalItems / rowsPerPage);

  return (
    <Box>
      {/* Encabezado de la página */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Productos
        </Typography>
        {/* Botón para agregar nuevo producto */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Agregar Producto
        </Button>
      </Box>

      {/* Tabla de productos */}
      <TableContainer component={Paper}>
        <Table>
          {/* Encabezados de la tabla */}
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          {/* Cuerpo de la tabla */}
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>
                  <Typography variant="subtitle2">{producto.nombre}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">${producto.precio}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{producto.stock}</Typography>
                </TableCell>
                <TableCell>
                  {/* Buscar nombre de categoría por ID */}
                  {categorias.find((cat) => cat.id === producto.idCategoria)
                    ?.nombre || "N/A"}
                </TableCell>
                <TableCell>
                  {/* Botones de acción */}
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(producto)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(producto.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación simplificada */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      {/* Modal para formulario de producto */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingProduct ? "Editar Producto" : "Nuevo Producto"}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            {/* Campo nombre */}
            <TextField
              name="nombre"
              label="Nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
              required
            />

            {/* Campo precio */}
            <TextField
              name="precio"
              label="Precio"
              type="number"
              value={formData.precio}
              onChange={handleInputChange}
              fullWidth
              required
            />

            {/* Campo stock */}
            <TextField
              name="stock"
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              fullWidth
              required
            />

            {/* Campo descripción */}
            <TextField
              name="descripcion"
              label="Descripción"
              value={formData.descripcion}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
            />

            {/* Campo imagen */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Imagen del Producto
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginBottom: '16px' }}
              />
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Selector de categoría */}
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                name="idCategoria"
                value={formData.idCategoria}
                onChange={handleInputChange}
                label="Categoría"
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Switch para oferta */}
            <FormControlLabel
              control={
                <Switch
                  name="oferta"
                  checked={formData.oferta}
                  onChange={handleInputChange}
                />
              }
              label="En Oferta"
            />

            {/* Campo descuento (solo si está en oferta) */}
            {formData.oferta && (
              <TextField
                name="descuento"
                label="Descuento (%)"
                type="number"
                value={formData.descuento}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 100 }}
              />
            )}
          </Box>
        </DialogContent>

        {/* Botones del modal */}
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProduct ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductosAdmin;
