import mariadb from 'mariadb';
/**
 * @typedef {Object} ProcessEnv
 * @property {string} DB_HOST - La IP o el hostname del servidor de la base de datos.
 * @property {string} DB_USER - El usuario de la base de datos.
 * @property {string} DB_PASSWORD - La contraseña del usuario de la base de datos.
 * @property {string} DB_DATABASE - Nombre de la base de datos.
 */
const pool = mariadb.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database:  process.env.DB_DATABASE
});

export default pool;