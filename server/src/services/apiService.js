/**
 * @file apiService.js
 * @module Services
 * @description Capa de servicio unificada para las consultas de la API.
 * Orquesta la obtención de datos para los dashboards (visitas activas, historiales)
 * y para los catálogos, aplicando la lógica de autorización basada en roles.
 * @requires sequelize
 * @requires ../repositories/*.js
 * @requires ../config/logger.js
 */

import { Op } from "sequelize";
import * as visitRepository from "../repositories/visitRepository.js";
import * as packageRepository from "../repositories/packageRepository.js";
import * as areaRepository from "../repositories/areaRepository.js";
import * as identificationTypeRepository from "../repositories/identificationTypeRepository.js";
import * as packageTypeRepository from "../repositories/packageTypeRepository.js";
import * as parkingLogRepository from "../repositories/parkingLogRepository.js";

import logger from "../config/logger.js";

import {
  exportRadicadosToExcel,
  exportRadicadosToPDF,
} from "../utils/exportUtils.js";

/**
 * @async
 * @function getAreas
 * @description Obtiene una lista de todas las áreas.
 * @returns {Promise<Array<object>>}
 */
export const getAreas = async () => {
  logger.info("Solicitando lista de áreas del catálogo.");
  const areas = await areaRepository.findAll();
  if (!areas) {
    return null;
  }
  return areas;
};

/**
 * @async
 * @function getIdentificationTypes
 * @description Obtiene una lista de todos los tipos de identificación.
 * @returns {Promise<Array<object>>}
 */
export const getIdentificationTypes = async () => {
  logger.info("Solicitando lista de tipos de identificación del catálogo.");
  const identificationTypes = await identificationTypeRepository.findAll();
  if (!identificationTypes) {
    return null;
  }
  return identificationTypes;
};

/**
 * @async
 * @function getPackageTypes
 * @description Obtiene una lista de todos los tipos de paquetes.
 * @returns {Promise<Array<object>>}
 */
export const getPackageTypes = async () => {
  logger.info("Solicitando lista de tipos de paquetes del catálogo.");
  const packageTypes = await packageTypeRepository.findAll();
  if (!packageTypes) {
    return null;
  }
  return packageTypes;
};

// --- SERVICIOS DE DASHBOARD E HISTORIAL ---

/**
 * @async
 * @function getActiveVisits
 * @description Obtiene un listado de todas las visitas que están actualmente activas.
 * @returns {Promise<Array<object>>}
 */
export const getActiveVisits = async () => {
  logger.info("Solicitando lista de visitas activas.");
  const activeVisits = await visitRepository.findAll({
    where: { estado: true },
    order: [["fecha_entrada", "DESC"]],
  });
  if (!activeVisits) {
    return null;
  }
  return activeVisits;
};

/**
 * @async
 * @function getPackagesHistory
 * @description Obtiene el historial de paquetes, filtrado por rol. La búsqueda por texto se delega al frontend.
 * @param {object} user - El usuario autenticado que realiza la solicitud.
 * @returns {Promise<Array<object>>}
 */
export const getPackagesHistory = async (user) => {
  logger.info(
    { userId: user.id_usuario },
    "Solicitando historial de paquetes."
  );

  const options = {
    order: [
      ["fecha_recibido", "DESC"],
      ["fecha_envio", "DESC"],
    ],
    where: {},
  };

  // Lógica de rol: Un 'portero' solo ve los paquetes que ha gestionado.
  if (user.rol === "portero") {
    options.where = {
      [Op.or]: [
        { id_usuario_recibir: user.id_usuario },
        { id_usuario_enviar: user.id_usuario },
      ],
    };
  }

  // Si es 'admin', el 'where' queda vacío, por lo que ve todo.
  const packageHistory = await packageRepository.findAll(options);

  if (!packageHistory) {
    return null;
  }

  return packageHistory;
};

/**
 * @async
 * @function getVisitsHistory
 * @description Obtiene el historial de visitas, filtrado por rol. La búsqueda por texto se delega al frontend.
 * @param {object} user - El usuario autenticado que realiza la solicitud.
 * @returns {Promise<Array<object>>}
 */
export const getVisitsHistory = async (user) => {
  logger.info({ userId: user.id_usuario }, "Solicitando historial de visitas.");

  const options = {
    order: [["fecha_entrada", "DESC"]],
    where: {},
  };

  // Lógica de rol: Un 'portero' solo ve las visitas que ha gestionado.
  if (user.rol === "portero") {
    options.where = {
      [Op.or]: [
        { id_usuario_entrada: user.id_usuario },
        { id_usuario_salida: user.id_usuario },
      ],
    };
  }

  // Si es 'admin', el 'where' queda vacío, por lo que ve todo.
  const visitHistory = await visitRepository.findAll(options);

  if (!visitHistory) {
    return null;
  }

  return visitHistory;
};

export const getParkingLogs = async () => {
  const options = {
    where: {
      fecha_salida: { [Op.ne]: null },
    },
    order: [["fecha_salida", "DESC"]],
  };

  const parkingLogs = await parkingLogRepository.findAll(options);
  if (!parkingLogs) {
    return null;
  }

  return parkingLogs;
};

/**
 * @async
 * @function getFiles
 * @description Obtiene el historial de todos los paquetes marcados como 'radicado', filtrado por rol.
 * @param {object} user - El usuario autenticado que realiza la solicitud.
 * @returns {Promise<Array<object>>}
 */
export const getFiles = async (user) => {
  const options = {
    where: {
      es_radicado: true,
    },
    order: [["fecha_recibido", "DESC"]],
  };

  if (user.rol === "portero") {
    options.where.id_usuario_recibir = user.id_usuario;
  }

  const files = await packageRepository.findAll(options);

  if (!files) {
    return null;
  }

  return files;
};

/**
 * @async
 * @function exportFiles
 * @description Prepara y genera el archivo (Excel o PDF) para el historial de radicados.
 * @param {object} user - El usuario autenticado.
 * @param {'excel' | 'pdf'} format - El formato de archivo deseado.
 * @returns {Promise<{buffer: Buffer, fileName: string, mimeType: string}>}
 * @throws {BadRequestError} Si el formato no es soportado.
 * @throws {NotFoundError} Si no hay datos para exportar.
 */
export const exportFiles = async (user, format) => {
  logger.info(
    { userId: user.id_usuario, format },
    `Iniciando exportación de radicados a ${format}.`
  );

  // 1. Obtener todos los datos (sin paginación)
  // Reutiliza la lógica de getRadicadosHistory
  const options = {
    where: { es_radicado: true },
    order: [["fecha_recibido", "DESC"]],
  };
  if (user.rol === "portero") {
    options.where.id_usuario_recibir = user.id_usuario;
  }

  const radicados = await packageRepository.findFiles(options);

  if (!radicados || radicados.length === 0) {
    throw new NotFoundError("No hay radicados para exportar.");
  }

  const timestamp = new Date().toISOString().split("T")[0]; // ej. 2025-10-31
  let buffer, fileName, mimeType;

  // 2. Generar el archivo según el formato
  if (format === "excel") {
    buffer = await exportRadicadosToExcel(radicados);
    fileName = `Historial_Radicados_${timestamp}.xlsx`;
    mimeType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  } else if (format === "pdf") {
    buffer = await exportRadicadosToPDF(radicados);
    fileName = `Historial_Radicados_${timestamp}.pdf`;
    mimeType = "application/pdf";
  } else {
    throw new BadRequestError(
      "Formato de exportación no soportado. Use 'excel' o 'pdf'."
    );
  }

  // 3. Devolver el buffer y metadatos al controlador
  return { buffer, fileName, mimeType };
};
