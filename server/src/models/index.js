/**
 * @file index.js
 * @module Models
 * @description Archivo de inicialización principal para Sequelize.
 * Se encarga de conectar a la base de datos, cargar dinámicamente todos los modelos,
 * establecer sus asociaciones y exportar el objeto `db` con la instancia de Sequelize
 * y todos los modelos listos para ser usados en los repositorios.
 * @requires sequelize
 */

import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import dbConfig from "../config/db.config.js";
import logger from "../config/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

const db = {};
let sequelize;

try {
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    );
  }
  logger.info("Instancia de Sequelize creada.");
} catch (error) {
  logger.fatal(error, "Error al crear la instancia de Sequelize.");
  process.exit(1);
}

// Carga dinámica de todos los modelos del directorio y subdirectorios
const findModelFiles = (dir) => {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = [...files, ...findModelFiles(fullPath)];
    } else if (
      item.name.indexOf(".") !== 0 &&
      item.name !== path.basename(__filename) &&
      item.name.slice(-3) === ".js"
    ) {
      files.push(fullPath);
    }
  }
  return files;
};

const modelFiles = findModelFiles(__dirname);
logger.info(`Encontrados ${modelFiles.length} archivos de modelos.`);

for (const file of modelFiles) {
  try {
    const modelURL = pathToFileURL(file).href;
    const modelModule = await import(modelURL);
    if (modelModule.default && typeof modelModule.default === "function") {
      const model = modelModule.default(sequelize, DataTypes);
      db[model.name] = model;
      logger.debug(`✓ Modelo '${model.name}' cargado.`);
    }
  } catch (error) {
    logger.error(
      error,
      `✗ Error al cargar el modelo desde el archivo: ${file}`
    );
  }
}

// Establecimiento de asociaciones entre modelos
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
    logger.debug(`✓ Asociaciones de '${modelName}' establecidas.`);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
