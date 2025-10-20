/**
 * @file envLoader.js
 * @module Config
 * @description Script para cargar las variables de entorno desde un archivo .env.
 * Debe ser la primera importación en el punto de entrada del servidor (server.js)
 * para asegurar que `process.env` esté poblado antes de que cualquier otra parte de la
 * aplicación intente acceder a estas variables.
 * @requires dotenv
 * @requires path
 * @requires url
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

/**
 * @description En el sistema de módulos de ECMAScript (ESM), las variables globales como `__dirname` no existen.
 * Este bloque de código recrea esa funcionalidad de forma segura.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @description Carga el archivo .env ubicado en la raíz de la carpeta 'server'.
 * @param {object} options - Objeto de configuración para dotenv.
 * @param {string} options.path - La ruta explícita al archivo .env.
 */
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
