const { Mensaje, Producto } = require("../models/index.model");
const { validationResult } = require("express-validator");

// Función para obtener mensajes de un producto
const getMensajesPorProducto = async (req, res) => {
  const { productoId } = req.params;

  try {
    // Buscar el producto para asegurarse de que existe
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado.",
      });
    }

    const mensajes = await Mensaje.findAll({
      where: { productoId: productoId },
    });

    res.status(200).json({
      success: true,
      data: mensajes,
    });
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor al obtener mensajes.",
      error: error.message,
    });
  }
};

// Función para crear un nuevo mensaje
const crearMensaje = async (req, res) => {
  const { productoId } = req.params;
  const { texto } = req.body;

  try {
    // Buscar el producto para asegurarse de que existe
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado.",
      });
    }

    // Crear un nuevo mensaje
    const nuevoMensaje = await Mensaje.create({
      productoId: productoId,
      texto: texto,
    });

    res.status(201).json({
      success: true,
      data: nuevoMensaje,
    });
  } catch (error) {
    console.error("Error al crear mensaje:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor al crear el mensaje.",
      error: error.message,
    });
  }
};


module.exports = {
  getMensajesPorProducto,
  crearMensaje,
};
