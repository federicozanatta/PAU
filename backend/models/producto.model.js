const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Producto = sequelize.define(
  "Producto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // CAMBIO: de "imagen" a "imagenes" tipo JSON para múltiples imágenes
    imagenes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue('imagenes');
        // Si es string, parsearlo
        if (typeof rawValue === 'string') {
          try {
            return JSON.parse(rawValue);
          } catch (e) {
            return [];
          }
        }
        // Si es array, devolverlo tal cual
        if (Array.isArray(rawValue)) {
          return rawValue;
        }
        // Si es null o undefined, devolver array vacío
        return [];
      },
      set(value) {
        // Asegurar que siempre se guarde como array
        if (Array.isArray(value)) {
          this.setDataValue('imagenes', value);
        } else if (typeof value === 'string') {
          try {
            this.setDataValue('imagenes', JSON.parse(value));
          } catch (e) {
            this.setDataValue('imagenes', []);
          }
        } else {
          this.setDataValue('imagenes', []);
        }
      }
    },
    oferta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    descuento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    idAdministrador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "administradores",
        key: "id",
      },
    },
    idCategoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categorias",
        key: "id",
      },
    },
  },
  {
    tableName: "productos",
    timestamps: true,
  }
);

module.exports = Producto;
