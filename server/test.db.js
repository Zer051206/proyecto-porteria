/**
 * @file testPoolConnection.js
 * @module testPoolConnection
 * @description Script independiente para probar la conexión con el pool de la base de datos
 * usando la configuración de 'db.config.js'. Ejecuta una consulta simple para verificar
 * el estado de la conexión.
 */
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { getPool } from "./src/config/db.config.js";

/**
 * @async
 * @function testPoolConnection
 * @description Función principal asíncrona que intenta obtener una conexión del pool,
 * ejecuta una consulta de prueba ('SELECT 1+1'), y libera la conexión.
 * Muestra el éxito o fracaso de la conexión y la consulta en la consola.
 * @returns {void}
 */
async function testPoolConnection() {
  let conn;
  try {
    console.log("Intentando obtener una conexión del pool...");

    // Obtiene la conexión usando la nueva función getPool()
    const pool = getPool();
    conn = await pool.getConnection();

    console.log("¡Conexión del pool exitosa!");
    const rows = await conn.query("SELECT 1+1 as result");
    console.log("Resultado de la consulta:", rows[0].result);
  } catch (err) {
    console.error("Error de conexión:", err.message);
    console.error("Detalles del error:", err);
  } finally {
    if (conn) conn.release();
  }
}

testPoolConnection();
