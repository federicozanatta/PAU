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
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
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
    idAdministrador: 1,
  });

  // Estados para múltiples imágenes
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

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

    

      // Normalizar imagenes - puede venir como string o array
      let imagenesArray = [];
      if (product.imagenes) {
        if (typeof product.imagenes === "string") {
          try {
            imagenesArray = JSON.parse(product.imagenes);
          } catch (e) {
            console.error("Error parsing imagenes:", e);
            imagenesArray = [];
          }
        } else if (Array.isArray(product.imagenes)) {
          imagenesArray = product.imagenes;
        }
      }

      if (imagenesArray && imagenesArray.length > 0){
        setImagePreviews(
          imagenesArray.map((img) => {
          // si ya es URL completa, usarla; si solo es nombre de archivo, construir URL
          return img.startsWith('http') ? img : `http://localhost:3000/uploads/${img}`;
        })
      );
      } else {
        setImagePreviews([]);
      }

      // No tocar imageFiles al abrir para edición
      setImageFiles([]);
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
      setImageFiles([]);
      setImagePreviews([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Manejar múltiples imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async () => {
    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          submitData.append("imagenes", file); // Backend debe aceptar array
        });
      }

      if (editingProduct) {
        await axios.put(
          `http://localhost:3000/api/productos/${editingProduct.id}`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post("http://localhost:3000/api/productos", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      fetchProductos();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

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
      {/* Encabezado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Productos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Agregar Producto
        </Button>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell align="right">${producto.precio}</TableCell>
                <TableCell align="right">{producto.stock}</TableCell>
                <TableCell>
                  {categorias.find((c) => c.id === producto.idCategoria)
                    ?.nombre || "N/A"}
                </TableCell>
                <TableCell>
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

      {/* Paginación */}
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

      {/* Modal */}
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
            <TextField
              name="nombre"
              label="Nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="precio"
              label="Precio"
              type="number"
              value={formData.precio}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="stock"
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="descripcion"
              label="Descripción"
              value={formData.descripcion}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
            />

            {/* Campo imágenes */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Imágenes del Producto
              </Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ marginBottom: "16px" }}
              />
              {imagePreviews.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{
                        maxWidth: "120px",
                        maxHeight: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                name="idCategoria"
                value={formData.idCategoria}
                onChange={handleInputChange}
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
