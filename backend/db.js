const { Pool } = require('pg');

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: DB_USER,         // Reemplaza con tu usuario de PostgreSQL
  host: DB_HOST,          // Usualmente 'localhost' si estás trabajando localmente
  database: DB_DATABASE, // Nombre de tu base de datos
  password: DB_PASSWORD,   // Reemplaza con tu contraseña de PostgreSQL
  port: DB_PORT,                 // Puerto por defecto de PostgreSQL
});

module.exports = pool;
