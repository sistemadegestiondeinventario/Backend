const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// If DATABASE_URL is provided (e.g., production), use it
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
  });
} else if (process.env.DB_NAME && process.env.DB_USER) {
  // Standard Postgres via env vars
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );
} else {
  // Fallback to a local SQLite file for quick local testing when Postgres/Docker is not available
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_FILE || './database.sqlite',
    logging: false,
  });
}

module.exports = sequelize;