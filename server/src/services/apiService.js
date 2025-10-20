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
import logger from "../config/logger.js";

// --- SERVICIOS DE CATÁLOGO ---

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
 * @function getPackageHistory
 * @description Obtiene el historial de paquetes, filtrado por rol. La búsqueda por texto se delega al frontend.
 * @param {object} user - El usuario autenticado que realiza la solicitud.
 * @returns {Promise<Array<object>>}
 */
export const getPackageHistory = async (user) => {
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
 * @function getVisitHistory
 * @description Obtiene el historial de visitas, filtrado por rol. La búsqueda por texto se delega al frontend.
 * @param {object} user - El usuario autenticado que realiza la solicitud.
 * @returns {Promise<Array<object>>}
 */
export const getVisitHistory = async (user) => {
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
