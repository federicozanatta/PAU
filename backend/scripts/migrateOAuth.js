const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { sequelize } = require('../models/index.model');

async function migrateOAuth() {
  try {
    console.log('🔄 Iniciando migración de OAuth...');

    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    await sequelize.query(`
      ALTER TABLE clientes
      ADD COLUMN IF NOT EXISTS googleId VARCHAR(255) NULL,
      ADD COLUMN IF NOT EXISTS authProvider VARCHAR(255) NULL
    `);

    console.log('✅ Columnas googleId y authProvider agregadas exitosamente');

    await sequelize.close();
    console.log('✅ Migración completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
}

migrateOAuth();
