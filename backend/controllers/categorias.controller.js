const { Categoria, Producto } = require("../models/index.model");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

// ============================
// Obtener todas las categorías
// ============================
const getCategorias = async (req, res) => {
  try {
    console.log("GET /categorias");

    // Parámetros con valores por defecto
    let {
      page = 1,
      limit = 10,
      activo = "all",
      search = "",
      sort = "createdAt",
      direction = "DESC",
    } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    direction = direction.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const offset = (page - 1) * limit;

    console.log("****");
    console.log("parametros: ", page, limit, activo, search, sort, direction);

    // Construir whereClause
    const whereClause = {};
    if (activo === "true") whereClause.activa = true;
    if (activo === "false") whereClause.activa = false;

    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    const categorias = await Categoria.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sort, direction]],
    });

    res.json({
      success: true,
      data: categorias.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(categorias.count / limit),
        totalItems: categorias.count,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error("Error en getCategorias:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener las categorías",
    });
  }
};

// ============================
// Obtener una categoría por ID
// ============================
const getCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de categoría inválido",
      });
    }

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        error: "Categoría no encontrada",
      });
    }

    res.json({ success: true, data: categoria });
  } catch (err) {
    console.error("Error en getCategoria:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo obtener la categoría",
    });
  }
};

// ===================================
// Obtener productos por categoría
// ===================================
const getProductosByCategoria = async (req, res) => {
  try {
    let { page = 1, limit = 10, activo = "all", search = "" } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID inválido" });
    }

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ success: false, error: "Categoría no encontrada" });
    }

    const whereClause = { idCategoria: id }; // tu columna en Producto

    if (activo === "true") whereClause.activa = true;
    if (activo === "false") whereClause.activa = false;

    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    const productos = await Producto.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: productos.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(productos.count / limit),
        totalItems: productos.count,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error("Error en getProductosByCategoria:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener los productos de la categoría",
    });
  }
};

// Crear nueva categoría
const createCategoria = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: "Datos inválidos", details: errors.array() });
    }

    const { nombre, descripcion, activa } = req.body;
    const imagenUrl = req.file ? req.file.filename : null;

    const nuevaCategoria = await Categoria.create({
      nombre,
      descripcion,
      activa: activa === "true" || activa === true,
      imagenUrl,
    });

    res.status(201).json({ success: true, data: nuevaCategoria, message: "Categoría creada exitosamente" });
  } catch (err) {
    console.error("Error en createCategoria:", err);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};

// Actualizar categoría
const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: "Datos inválidos", details: errors.array() });
    }

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ success: false, error: "Categoría no encontrada" });
    }

    // Crear un objeto con los datos que sí existen en req.body
    const datosActualizar = {};
    if (req.body.nombre) datosActualizar.nombre = req.body.nombre;
    if (req.body.descripcion) datosActualizar.descripcion = req.body.descripcion;
    if (req.body.activa !== undefined) datosActualizar.activa = req.body.activa === 'true' || req.body.activa === true;
    if (req.file) datosActualizar.imagenUrl = req.file.filename;

    await categoria.update(datosActualizar);

    res.json({ success: true, data: categoria, message: "Categoría actualizada exitosamente" });
  } catch (err) {
    console.error("Error en updateCategoria:", err);
    res.status(500).json({ success: false, error: "Error interno", message: "No se pudo actualizar la categoría" });
  }
};


// ============================
// Eliminar categoría (borrado lógico)
// ============================
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ success: false, error: "Categoría no encontrada" });
    }

    await categoria.update({ activa: false });

    res.json({ success: true, message: "Categoría eliminada exitosamente" });
  } catch (err) {
    console.error("Error en deleteCategoria:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo eliminar la categoría",
    });
  }
};

module.exports = {
  getCategorias,
  getCategoria,
  getProductosByCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
