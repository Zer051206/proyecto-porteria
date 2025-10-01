/**
 * @file db.config.js
 * @module dbConfig
 * @description Configuración centralizada para la conexión a la base de datos MariaDB.
 * Implementa un patrón Singleton para asegurar que solo se cree una única instancia
 * del Pool de conexiones.
 */

import mariadb from "mariadb";

/**
 * @private
 * @type {mariadb.Pool|null}
 * @description Almacena la única instancia del Pool de conexiones de MariaDB (patrón Singleton).
 * Es inicializado solo la primera vez que se llama a getPool().
 */
let pool;

/**
 * @function getPool
 * @description Retorna la única instancia del Pool de conexiones de MariaDB.
 * Si el pool no ha sido creado, lo inicializa utilizando las variables de entorno.
 * @returns {mariadb.Pool} La instancia del Pool de conexiones lista para ser utilizada.
 */
export function getPool() {
  if (pool) {
    return pool;
  }

  // Inicializa el pool si no existe
  pool = mariadb.createPool({
    host: process.env.DB_MARIA_HOST,
    user: process.env.DB_MARIA_USER,
    password: process.env.DB_MARIA_PASSWORD,
    database: process.env.DB_MARIA_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    port: 3306,
  });

  return pool;
}
