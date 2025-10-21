/**
 * @file test.db.js
 * @module Test
 * @description Script para probar la conexión y la inicialización de Sequelize.
 * @requires ./envLoader.js
 * @requires ./src/models/index.js
 * @requires ./src/config/logger.js
 */

import "./envLoader.js";
import db from "./src/models/index.js";
import logger from "./src/config/logger.js";

/**
 * @async
 * @function testSequelizeConnection
 * @description Verifica la conexión, la carga de modelos y la capacidad de ejecutar una consulta simple a través de un modelo.
 * @returns {Promise<void>}
 */
async function testSequelizeConnection() {
  try {
    logger.info("Intentando autenticar la conexión de Sequelize a MariaDB...");
    await db.sequelize.authenticate();
    logger.info("✅ Conexión a MariaDB establecida exitosamente.");

    // En lugar de una consulta cruda, usamos un modelo para una prueba más realista.
    // Esto verifica que los modelos se cargaron y las tablas existen.
    logger.info("Ejecutando consulta de prueba con el modelo 'User'...");
    const userCount = await db.User.count();
    logger.info(
      { userCount },
      `Consulta de prueba exitosa. Se encontraron ${userCount} usuarios.`
    );
  } catch (err) {
    logger.error(err, "❌ Falló la prueba de conexión a la base de datos");
  } finally {
    if (db.sequelize) {
      await db.sequelize.close();
      logger.info("Conexión de Sequelize cerrada.");
    }
  }
}

testSequelizeConnection();
