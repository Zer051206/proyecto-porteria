/**
 * @file apiController.js
 * @module apiController
 * @description Controladores para endpoints de la API general, que incluyen la obtención
 * de catálogos (áreas, tipos de identificación, tipos de paquetes) e historiales.
 * Delega la lógica de negocio al apiService.
 */
import logger from "../config/logger.js";
import * as apiService from "../services/apiService.js";

/**
 * @async
 * @function getAreas
 * @description Obtiene el listado de todas las áreas disponibles.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y la lista de áreas en formato JSON.
 */
export const getAreas = async (req, res, next) => {
  try {
    const areas = await apiService.getAreas();
    return res.status(200).json(areas);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getIdentificationTypes
 * @description Obtiene el listado de tipos de identificación válidos.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y la lista de tipos de identificación.
 */
export const getIdentificationTypes = async (req, res, next) => {
  try {
    const tiposIdentificacion = await apiService.getIdentificationTypes();
    return res.status(200).json(tiposIdentificacion);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getActiveVisits
 * @description Obtiene un listado de todas las visitas que se encuentran activas (pendientes de salida).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y el listado de visitas activas.
 */
export const getActiveVisits = async (req, res, next) => {
  try {
    const activeVisits = await apiService.getActiveVisits();
    return res.status(200).json(activeVisits);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getPackageTypes
 * @description Obtiene el listado de tipos de paquetes disponibles.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y la lista de tipos de paquetes.
 */
export const getPackageTypes = async (req, res, next) => {
  try {
    const tiposPaquetes = await apiService.getPackageTypes();
    return res.status(200).json(tiposPaquetes);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getVisitsHistorial
 * @description Obtiene el historial completo de visitas, con soporte opcional para búsqueda (user).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y el historial de visitas.
 */
export const getVisitsHistorial = async (req, res, next) => {
  try {
    /**
     * @const {object | undefined} user - El usuario que realiza la petición.
     */
    const user = req.user;
    const visitsHistorial = await apiService.getVisitsHistory(user);
    return res.status(200).json(visitsHistorial);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getPackagesHistorial
 * @description Obtiene el historial completo de paquetes, con soporte opcional para búsqueda (user).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y el historial de paquetes.
 */
export const getPackagesHistorial = async (req, res, next) => {
  try {
    /**
     * @const {object | undefined} user - El usuario que realiza la petición.
     */
    const user = req.user;
    const packagesHistorial = await apiService.getPackagesHistory(user);
    return res.status(200).json(packagesHistorial);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getParkingLogs
 * @description Obtiene el historial completo de registros de parqueadero (solo salidas), filtrado por rol.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y el historial de parqueadero.
 */
export const getParkingLogs = async (req, res, next) => {
  try {
    const parkingLogs = await apiService.getParkingLogs();
    return res.status(200).json(parkingLogs);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getFiles
 * @description Obtiene el historial de todos los paquetes marcados como 'radicado', filtrado por rol.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y la lista de radicados.
 */
export const getFiles = async (req, res, next) => {
  try {
    const user = req.user;
    const files = await apiService.getFiles(user);
    return res.status(200).json(files);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function exportFiles
 * @description Controlador para generar y enviar un archivo (Excel o PDF) del historial de radicados.
 * @param {object} req - Objeto de solicitud de Express. Espera `req.query.format` ('excel' o 'pdf').
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Envía un archivo .xlsx o .pdf, o pasa un error.
 */
export const exportFiles = async (req, res, next) => {
  try {
    const user = req.user;
    const format = req.query.format || "excel";

    logger.info(
      { userId: user.id_usuario, format },
      `Solicitud de exportación de radicados en formato ${format}.`
    );
    const { buffer, fileName, mimeType } = await apiService.exportFiles(
      user,
      format
    );
    res.setHeader("Content-Type", mimeType);

    const encodedFileName = encodeURIComponent(fileName);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`
    );

    return res.send(buffer);
  } catch (error) {
    next(error);
  }
};
