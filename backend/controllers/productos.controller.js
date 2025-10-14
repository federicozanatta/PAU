const { Producto, Categoria, Administrador, Variante, Mensaje } = require("../models/index.model");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const { page = 1, limit = 20, idCategoria, oferta = undefined } = req.query;
    const offset = (page - 1) * limit;

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
    console.error("❌ Error en getProductos:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
};

// Obtener un producto por ID
const getProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id, {
      include: [
        { model: Categoria, as: "categoria", attributes: ["id", "nombre"] },
        { model: Administrador, as: "administrador", attributes: ["id", "usuario"] },
        { model: Variante, as: "variantes", attributes: ["id", "nombre", "precio", "stock"] },
        { model: Mensaje, as: "mensajes", attributes: ["id", "texto"], limit: 10, order: [["id", "DESC"]] },
      ],
    });

    if (!producto) {
      return res.status(404).json({ success: false, error: "Producto no encontrado" });
    }

    res.json({ success: true, data: producto });
  } catch (err) {
    console.error("Error en getProducto:", err);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
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

    // Obtener nombres de los archivos subidos como array
    const imagenes = req.files ? req.files.map(f => f.filename) : [];

    const nuevoProducto = await Producto.create({
      nombre,
      precio,
      descripcion,
      stock,
      imagenes: imagenes,
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

    // Si hay error y se subieron archivos, eliminar
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads', file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
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

    // Si se suben nuevas imágenes
    if (req.files && req.files.length > 0) {
      // Eliminar imágenes antiguas si existen
      if (producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
        producto.imagenes.forEach(img => {
          const oldImagePath = path.join(__dirname, '../uploads', img);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        });
      }

      updateData.imagenes = req.files.map(f => f.filename);
    }

    await producto.update(updateData);

    res.json({
      success: true,
      data: producto,
      message: "Producto actualizado exitosamente",
    });
  } catch (err) {
    console.error("Error en updateProducto:", err);

    // Si hay error y se subieron archivos, eliminar
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads', file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
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
      return res.status(404).json({ success: false, error: "Producto no encontrado" });
    }

    if (producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
      producto.imagenes.forEach((img) => {
        const imagePath = path.join(__dirname, "../uploads", img);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      });
    }

    await producto.destroy();

    res.json({ success: true, message: "Producto eliminado exitosamente" });
  } catch (err) {
    console.error("Error en deleteProducto:", err);
    res.status(500).json({ success: false, error: "No se pudo eliminar el producto" });
  }
};

module.exports = {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
};
