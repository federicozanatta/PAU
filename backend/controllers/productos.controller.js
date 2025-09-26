const { Producto, Categoria, Administrador } = require("../models/index.model");
const { Variante, Mensaje } = require("../models/index.model");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    console.log("GET /productos - Iniciando...");
    console.log("Query params:", req.query);

    const { page = 1, limit = 20, idCategoria, oferta = undefined } = req.query;
    const offset = (page - 1) * limit;

    console.log("Parámetros procesados:", {
      page,
      limit,
      offset,
      idCategoria,
      oferta,
    });

    const whereClause = {};
    if (idCategoria) whereClause.idCategoria = idCategoria;
    if (oferta !== undefined) whereClause.oferta = oferta === "true";

    const productos = await Producto.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
    });

    res.json({
      success: true,
      data: productos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(productos.count / limit),
        totalItems: productos.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error("❌ Error completo en getProductos:");
    console.error("Mensaje:", err.message);
    console.error(err.stack);
    console.error("Nombre del error:", err.name);
    if (err.sql) console.error("SQL:", err.sql);

    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: err.message || "No se pudieron obtener los productos",
      details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

// Obtener un producto por ID
const getProducto = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("GET /productos/:id", { id });

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de producto inválido",
      });
    }

    const producto = await Producto.findByPk(id, {
      include: [
        { model: Categoria, as: "categoria", attributes: ["id", "nombre"] },
        {
          model: Administrador,
          as: "administrador",
          attributes: ["id", "usuario"],
        },
        {
          model: Variante,
          as: "variantes",
          attributes: ["id", "nombre", "precio", "stock"],
        },
        {
          model: Mensaje,
          as: "mensajes",
          attributes: ["id", "texto"],
          limit: 10,
          order: [["id", "DESC"]],
        },
      ],
    });

    if (!producto) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    res.json({
      success: true,
      data: producto,
    });
  } catch (err) {
    console.error("Error en getProducto:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo obtener el producto",
    });
  }
};

// Crear un nuevo producto
const createProducto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos de entrada inválidos",
        details: errors.array(),
      });
    }

    const {
      nombre,
      precio,
      descripcion,
      stock,
      oferta,
      descuento,
      idAdministrador,
      idCategoria,
    } = req.body;

    // Obtener el nombre del archivo subido
    const imagen = req.file ? req.file.filename : null;

    const nuevoProducto = await Producto.create({
      nombre,
      precio,
      descripcion,
      stock,
      imagen,
      oferta,
      descuento,
      idAdministrador,
      idCategoria,
    });

    res.status(201).json({
      success: true,
      data: nuevoProducto,
      message: "Producto creado exitosamente",
    });
  } catch (err) {
    console.error("Error en createProducto:", err);
    
    // Si hay error y se subió un archivo, eliminarlo
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo crear el producto",
    });
  }
};

// Actualizar un producto
const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos de entrada inválidos",
        details: errors.array(),
      });
    }

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    const updateData = { ...req.body };
    
    // Si se subió una nueva imagen
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (producto.imagen) {
        const oldImagePath = path.join(__dirname, '../uploads', producto.imagen);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.imagen = req.file.filename;
    }

    await producto.update(updateData);

    res.json({
      success: true,
      data: producto,
      message: "Producto actualizado exitosamente",
    });
  } catch (err) {
    console.error("Error en updateProducto:", err);
    
    // Si hay error y se subió un archivo, eliminarlo
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo actualizar el producto",
    });
  }
};

// Eliminar un producto
const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    // Eliminar imagen asociada si existe
    if (producto.imagen) {
      const imagePath = path.join(__dirname, '../uploads', producto.imagen);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await producto.destroy();

    res.json({
      success: true,
      message: "Producto eliminado exitosamente",
    });
  } catch (err) {
    console.error("Error en deleteProducto:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo eliminar el producto",
    });
  }
};

module.exports = {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
};
