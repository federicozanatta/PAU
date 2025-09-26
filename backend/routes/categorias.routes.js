const express = require("express");
const router = express.Router();
const categoriasController = require("../controllers/categorias.controller");
const { 
    validatePagination, 
    validateCategoriaCreate, 
    validateCategoriaUpdate, 
    validateCategoriaId 
} = require("../middleware/validation");

// GET /api/categorias - Obtener todas las categorías
router.get("/", validatePagination, categoriasController.getCategorias);

// GET /api/categorias/:id - Obtener una categoría por ID
router.get("/:id", validateCategoriaId, categoriasController.getCategoria);

// GET /api/categorias/:id/productos - Obtener productos por categoría
router.get("/:id/productos", validateCategoriaId, validatePagination, categoriasController.getProductosByCategoria);

// POST /api/categorias - Crear una nueva categoría
router.post("/", validateCategoriaCreate, categoriasController.createCategoria);

// PUT /api/categorias/:id - Actualizar una categoría
router.put("/:id", validateCategoriaId, validateCategoriaUpdate, categoriasController.updateCategoria);

// DELETE /api/categorias/:id - Eliminar una categoría (soft delete)
router.delete("/:id", validateCategoriaId, categoriasController.deleteCategoria);

module.exports = router;