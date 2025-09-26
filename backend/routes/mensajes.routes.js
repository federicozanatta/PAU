const express = require("express");
const router = express.Router();
const mensajesController = require("../controllers/mensajes.controller");

router.get("/:productoId/mensajes", mensajesController.getMensajesPorProducto);

router.post("/:productoId/mensajes", mensajesController.crearMensaje);


module.exports = router;
