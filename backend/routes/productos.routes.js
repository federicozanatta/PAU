const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productos.controller");
const mensajesController = require("../controllers/mensajes.controller");
const { uploadSingle, uploadMultiple } = require("../middleware/upload.middleware");

// GET /api/productos - Obtener todos los productos con paginación y filtros
router.get("/", productosController.getProductos);

// GET /api/productos/:id - Obtener un producto por ID
router.get("/:id", productosController.getProducto);

router.get("/:productoId/mensajes", mensajesController.getMensajesPorProducto);
router.post("/:productoId/mensajes", mensajesController.crearMensaje);

// POST /api/productos - Crear un nuevo producto
router.post("/", uploadMultiple, productosController.createProducto);

// PUT /api/productos/:id - Actualizar un producto
router.put("/:id", uploadMultiple, productosController.updateProducto);

// DELETE /api/productos/:id - Desactivar un producto (soft delete)
router.delete("/:id", productosController.deleteProducto);

module.exports = router;
