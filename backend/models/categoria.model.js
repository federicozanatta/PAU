const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Categoria = sequelize.define(
    "Categoria",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imagenUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      activa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "categorias",
      timestamps: true,
    }
  );


module.exports = Categoria;