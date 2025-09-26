const sequelize = require("../config/database");

const Producto = require("./producto.model");
const Categoria = require("./categoria.model");
const Administrador = require("./administrador.model");
const Carrito = require("./carrito.model");
const CarritoProducto = require("./carritoProducto.model");
const Cliente = require("./cliente.model");
const Direccion = require("./direccion.model");
const Envio = require("./envio.model");
const Pago = require("./pago.model");
const Pedido = require("./pedido.model");
const PedidoProducto = require("./pedidoProducto.model");
const Variante = require("./variante.model");
const CuponDescuento = require("./cuponDescuento.model");
const Mensaje = require("./mensaje.model");

console.log("📦 Cargando modelos...");
console.log("Modelos disponibles:", {
  Producto: !!Producto,
  Categoria: !!Categoria,
  Administrador: !!Administrador,
});

Cliente.hasMany(Direccion, {
  foreignKey: "idCliente",
  as: "direcciones",
});
Direccion.belongsTo(Cliente, {
  foreignKey: "idCliente",
  as: "cliente",
});

Cliente.hasMany(Pedido, {
  foreignKey: "idCliente",
  as: "pedidos",
});
Pedido.belongsTo(Cliente, {
  foreignKey: "idCliente",
  as: "cliente",
});

Cliente.hasOne(Carrito, {
  foreignKey: "idCliente",
  onDelete: "CASCADE",
  as: "carrito",
});
Carrito.belongsTo(Cliente, {
  foreignKey: "idCliente",
  as: "cliente",
});

Administrador.hasMany(Producto, {
  as: "productos",
  foreignKey: "idAdministrador",
});
Producto.belongsTo(Administrador, {
  as: "administrador",
  foreignKey: "idAdministrador",
});

Categoria.hasMany(Producto, {
  as: "productos",
  foreignKey: "idCategoria",
});
Producto.belongsTo(Categoria, {
  as: "categoria",
  foreignKey: "idCategoria",
});

// Asociaciones de Producto con Variante
Producto.hasMany(Variante, {
  foreignKey: "productoId",
  as: "variantes",
});
Variante.belongsTo(Producto, {
  foreignKey: "productoId",
  as: "producto",
});

Producto.hasMany(Mensaje, {
  foreignKey: "productoId",
  as: "mensajes",
});
Mensaje.belongsTo(Producto, {
  foreignKey: "productoId",
  as: "producto",
});

Carrito.hasMany(CarritoProducto, {
  foreignKey: "idCarrito",
  as: "productos",
});
CarritoProducto.belongsTo(Carrito, {
  foreignKey: "idCarrito",
  as: "carrito",
});

Producto.hasMany(CarritoProducto, {
  foreignKey: "idProducto",
  as: "carritos",
});
CarritoProducto.belongsTo(Producto, {
  foreignKey: "idProducto",
  as: "producto",
});

Pedido.hasOne(Pago, {
  foreignKey: "idPedido",
  onDelete: "CASCADE",
  as: "pago",
});
Pago.belongsTo(Pedido, {
  foreignKey: "idPedido",
  as: "pedido",
});

Pedido.hasOne(Envio, {
  foreignKey: "idPedido",
  onDelete: "CASCADE",
  as: "envio",
});
Envio.belongsTo(Pedido, {
  foreignKey: "idPedido",
  as: "pedido",
});

Pedido.hasMany(PedidoProducto, {
  foreignKey: "idPedido",
  as: "productos",
});
PedidoProducto.belongsTo(Pedido, {
  foreignKey: "idPedido",
  as: "pedido",
});

Producto.hasMany(PedidoProducto, {
  foreignKey: "idProducto",
  as: "pedidos",
});
PedidoProducto.belongsTo(Producto, {
  foreignKey: "idProducto",
  as: "producto",
});

module.exports = {
  sequelize,
  Categoria,
  Administrador,
  Carrito,
  CarritoProducto,
  Cliente,
  Direccion,
  Envio,
  Pago,
  Pedido,
  PedidoProducto,
  Producto,
  CuponDescuento,
  Variante,
  Mensaje,
};
