import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Switch, FormControlLabel, Pagination
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";

const CuponesAdmin = () => {
  const [cupones, setCupones] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const rowsPerPage = 10;

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCupon, setEditingCupon] = useState(null);

  const [formData, setFormData] = useState({
    nombreCupon: "",
    codigoCupon: "",
    porcentajeDescuento: 0,
    activo: true,
  });

  useEffect(() => {
    fetchCupones();
  }, [page]);

  const fetchCupones = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/cupones?page=${page}&limit=${rowsPerPage}`);
      setCupones(res.data.data);
      setTotalItems(res.data.pagination.totalItems);
    } catch (error) {
      console.error("Error fetching cupones:", error);
    }
  };

  const handleOpenDialog = (cupon = null) => {
    if (cupon) {
      setEditingCupon(cupon);
      setFormData({ ...cupon });
    } else {
      setEditingCupon(null);
      setFormData({ nombreCupon: "", codigoCupon: "", porcentajeDescuento: 0, activo: true });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingCupon) {
        await axios.put(`http://localhost:3000/api/cupones/${editingCupon.id}`, formData);
      } else {
        await axios.post("http://localhost:3000/api/cupones", formData);
      }
      fetchCupones();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving cupon:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este cupón?")) {
      try {
        await axios.delete(`http://localhost:3000/api/cupones/${id}`);
        fetchCupones();
      } catch (error) {
        console.error("Error deleting cupon:", error);
      }
    }
  };

  const totalPages = Math.ceil(totalItems / rowsPerPage);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Cupones</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Agregar Cupón
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Código</TableCell>
              <TableCell align="right">Descuento (%)</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cupones.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.nombreCupon}</TableCell>
                <TableCell>{c.codigoCupon}</TableCell>
                <TableCell align="right">{c.porcentajeDescuento}%</TableCell>
                <TableCell>{c.activo ? "Sí" : "No"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(c)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(c.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination count={totalPages} page={page} onChange={(e, newPage) => setPage(newPage)} />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCupon ? "Editar Cupón" : "Nuevo Cupón"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField name="nombreCupon" label="Nombre" value={formData.nombreCupon} onChange={handleInputChange} fullWidth required />
            <TextField name="codigoCupon" label="Código" value={formData.codigoCupon} onChange={handleInputChange} fullWidth required />
            <TextField name="porcentajeDescuento" label="Descuento (%)" type="number" inputProps={{ min: 0, max: 100 }} value={formData.porcentajeDescuento} onChange={handleInputChange} fullWidth required />
            <FormControlLabel control={<Switch name="activo" checked={formData.activo} onChange={handleInputChange} />} label="Activo" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">{editingCupon ? "Actualizar" : "Crear"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CuponesAdmin;
