const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
```

**Archivo: `backend/.env.example`**
```
PORT=5000
DB_HOST=localhost
DB_NAME=inventario_db
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_clave_secreta_muy_segura