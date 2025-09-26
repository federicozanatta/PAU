const { Categoria, Producto } = require("../models/index.model");
const { validationResult } = require("express-validator");

// Obtener todas las categorías
const getCategorias = async (req, res) => {
  try {
    console.log("GET /categorias");

    const {
      page = 1,
      limit = 10,
      activo,
      search,
      sort = "createdAt",
      direction = "DESC",
    } = req.query;
    const offset = (page - 1) * limit;

    console.log("****");
    console.log("****");
    console.log("****");
    console.log("****");
    console.log("parametros: ", page, limit, activo, search, sort, direction);

    const whereClause = {};

    if (activo !== undefined && activo !== "all") {
      whereClause.activo = activo === "true";
    }

    if (search) {
      const { Op } = require("sequelize");
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}% ` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    const order = [[sort, direction.toUpperCase()]];

    const categorias = await Categoria.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: order,
    });

    res.json({
      success: true,
      data: categorias.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(categorias.count / limit),
        totalItems: categorias.count,
        itemsPerPage: parseInt(limit),
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

// Obtener una categoría por ID
const getCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("GET /categorias/:id", { id });

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

    res.json({
      success: true,
      data: categoria,
    });
  } catch (err) {
    console.error("Error en getCategoria:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo obtener la categoría",
    });
  }
};

// Obtener productos por categoría
const getProductosByCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, activo, search } = req.query;
    const offset = (page - 1) * limit;

    console.log("GET /categorias/:id/productos", { id });

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de categoría inválido",
      });
    }

    // Verificar si la categoría existe
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        error: "Categoría no encontrada",
      });
    }

    const whereClause = {
      categoriaId: id,
    };

    if (activo !== undefined && activo !== "all") {
      whereClause.activo = activo === "true";
    }

    if (search) {
      const { Op } = require("sequelize");
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}% ` } },
      ];
    }

    // Buscar productos por categoría
    const productos = await Producto.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
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
    console.error("Error en getProductosByCategoria:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener los productos de la categoría",
    });
  }
};

// Crear una nueva categoría
const createCategoria = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos de entrada inválidos",
        details: errors.array(),
      });
    }

    const { nombre, descripcion } = req.body;

    const nuevaCategoria = await Categoria.create({
      nombre,
      descripcion,
    });

    res.status(201).json({
      success: true,
      data: nuevaCategoria,
      message: "Categoría creada exitosamente",
    });
  } catch (err) {
    console.error("Error en createCategoria:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo crear la categoría",
    });
  }
};

// Actualizar una categoría
const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos de entrada inválidos",
        details: errors.array(),
      });
    }

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        error: "Categoría no encontrada",
      });
    }

    await categoria.update(req.body);

    res.json({
      success: true,
      data: categoria,
      message: "Categoría actualizada exitosamente",
    });
  } catch (err) {
    console.error("Error en updateCategoria:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo actualizar la categoría",
    });
  }
};

// Eliminar una categoría 
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        error: "Categoría no encontrada",
      });
    }

    await categoria.update({ activo: false });

    res.json({
      success: true,
      message: "Categoría eliminada exitosamente",
    });
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
