const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const categoriasController = require("../controllers/categorias.controller");
const { 
  validatePagination, 
  validateCategoriaCreate, 
  validateCategoriaUpdate, 
  validateCategoriaId 
} = require("../middleware/validation");

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // nombre único para cada archivo
  },
});

const upload = multer({ storage });

// Rutas

// GET /api/categorias - Obtener todas las categorías
router.get("/", validatePagination, categoriasController.getCategorias);

// GET /api/categorias/:id - Obtener una categoría por ID
router.get("/:id", validateCategoriaId, categoriasController.getCategoria);

// GET /api/categorias/:id/productos - Obtener productos por categoría
router.get("/:id/productos", validateCategoriaId, validatePagination, categoriasController.getProductosByCategoria);

// POST /api/categorias - Crear una nueva categoría con imagen
router.post(
  "/", 
  upload.single("imagen"),          // multer
  validateCategoriaCreate, 
  categoriasController.createCategoria
);

// PUT /api/categorias/:id - Actualizar categoría con imagen
router.put(
  "/:id", 
  validateCategoriaId, 
  upload.single("imagen"),          // multer
  validateCategoriaUpdate, 
  categoriasController.updateCategoria
);

// DELETE /api/categorias/:id - Eliminar categoría (soft delete)
router.delete("/:id", validateCategoriaId, categoriasController.deleteCategoria);

module.exports = router;
