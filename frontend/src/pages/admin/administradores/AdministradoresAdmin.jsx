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

const AdministradoresAdmin = () => {
  const [administradores, setAdministradores] = useState([]);

  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  const [totalItems, setTotalItems] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);

  const [editingAdmin, setEditingAdmin] = useState(null);

  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    contrasena: "",
    activa: true,
  });

  useEffect(() => {
    fetchAdministradores();
  }, [page]);

  /*
   Función para obtener administradores del servidor

   */
  const fetchAdministradores = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/administradores?page=${page}&limit=${rowsPerPage}&activa=all`
      );
      setAdministradores(response.data.data);
      setTotalItems(response.data.pagination.totalItems);
    } catch (error) {
      console.error("Error fetching administradores:", error);
    }
  };

  /**
   * Manejador para cambio de página
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /**
   * Función para abrir el modal de formulario
   * @param {Object|null} admin -
   */
  const handleOpenDialog = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        usuario: admin.usuario,
        email: admin.email || "",
        contrasena: "",
        activa: admin.activa,
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        usuario: "",
        email: "",
        contrasena: "",
        activa: true,
      });
    }
    setOpenDialog(true);
  };

  /**
   * Función para cerrar el modal
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAdmin(null);
  };

  /**
   * Manejador para cambios en inputs
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * Función para enviar el formulario
   */
  const handleSubmit = async () => {
    try {
      const dataToSend = { ...formData };

      // Si estamos editando y no hay contraseña nueva, no enviarla
      if (editingAdmin && !dataToSend.contrasena) {
        delete dataToSend.contrasena;
      }

      if (editingAdmin) {
        // Actualizar administrador existente
        await axios.put(
          `http://localhost:3000/api/administradores/${editingAdmin.id}`,
          dataToSend
        );
      } else {
        // Crear nuevo administrador
        await axios.post(
          "http://localhost:3000/api/administradores",
          dataToSend
        );
      }

      fetchAdministradores();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving admin:", error);
    }
  };

  /**
   * Función para eliminar (desactivar) un administrador
   */
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres desactivar este administrador?"
      )
    ) {
      try {
        await axios.delete(`http://localhost:3000/api/administradores/${id}`);
        fetchAdministradores();
      } catch (error) {
        console.error("Error deleting admin:", error);
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
        <Typography variant="h4" component="h1" fontWeight="bold">
          Administradores
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Agregar Administrador
        </Button>
      </Box>

      {/* Tabla de administradores */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {administradores.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <Typography variant="subtitle2">{admin.usuario}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {admin.email || "Sin email"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {admin.activa ? "Activo" : "Inactivo"}
                  </Typography>
                </TableCell>
                <TableCell>
                  {/* Botones de acción */}
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(admin)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(admin.id)}
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

      {/* Modal para formulario */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAdmin ? "Editar Administrador" : "Nuevo Administrador"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            {/* Campo usuario */}
            <TextField
              name="usuario"
              label="Usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              fullWidth
              required
            />

            {/* Campo email */}
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
            />

            {/* Campo contraseña */}
            <TextField
              name="contrasena"
              label={
                editingAdmin ? "Nueva Contraseña (opcional)" : "Contraseña"
              }
              type="password"
              value={formData.contrasena}
              onChange={handleInputChange}
              fullWidth
              required={!editingAdmin}
            />

            <FormControlLabel
              control={
                <Switch
                  name="activa"
                  checked={formData.activa}
                  onChange={handleInputChange}
                />
              }
              label="Administrador Activo"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAdmin ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdministradoresAdmin;
