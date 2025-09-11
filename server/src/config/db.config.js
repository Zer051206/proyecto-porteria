// src/config/db.config.js
import mariadb from 'mariadb';

let pool;

export function getPool() {
  if (pool) {
    return pool;
  }
  pool = mariadb.createPool({
    host: process.env.DB_MARIA_HOST, 
    user: process.env.DB_MARIA_USER, 
    password: process.env.DB_MARIA_PASSWORD, 
    database: process.env.DB_MARIA_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT
  });
  return pool;
}