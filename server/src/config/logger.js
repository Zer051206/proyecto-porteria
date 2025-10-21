/**
 * @file logger.js
 * @module Config
 * @description Configuración centralizada para el logger de la aplicación (Pino).
 * Exporta una instancia de logger que escribe logs en formato JSON estructurado.
 * El formateo para la visualización en desarrollo se delega a una herramienta externa
 * a través de un pipe en el script de npm.
 * @requires pino
 */
import pino from "pino";

/**
 * @const {pino.Logger} logger
 * @description Instancia del logger exportada para ser utilizada en toda la aplicación.
 * @property {string} level - El nivel mínimo de log a registrar.
 */
const logger = pino({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
});

export default logger;
