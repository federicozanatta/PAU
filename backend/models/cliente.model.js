const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cliente = sequelize.define(
    "Cliente",
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
      telefono: {
        type: DataTypes.STRING, // Mejor usar STRING para teléfonos (incluye prefijos, guiones)
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false, // El email es OBLIGATORIO para login (local o Google)
        unique: true,      // El email DEBE ser único
        validate: {
            isEmail: true,
        }
      },
      contrasena: {
        type: DataTypes.STRING,
        allowNull: true, // Puede ser nula si el usuario se registra con Google
      },
      googleId: { // Campo para almacenar el ID único de Google
        type: DataTypes.STRING,
        allowNull: true,
        unique: true, // Debe ser único para evitar cuentas duplicadas de Google
      },
      authProvider: { // Campo para saber si es 'local' o 'google'
        type: DataTypes.STRING,
        allowNull: false, // Debe ser obligatorio para saber el método de login
        defaultValue: 'local',
      },
    },
    {
      tableName: "clientes",
      // Si usas createdAt/updatedAt en tus SELECTs del backend, 
      // y quieres que sequelize las gestione, debes poner timestamps: true
      timestamps: true, 
    }
);

module.exports = Cliente;