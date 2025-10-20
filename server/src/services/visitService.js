/**
 * @file visitService.js
 * @module Services
 * @description Capa de servicio para la gestión de la lógica de negocio de las visitas.
 * Se encarga de la creación (entrada) y finalización (salida) de visitas, asegurando la integridad
 * de los datos a través de transacciones y registrando las acciones para auditoría.
 * @requires ../models/index.js
 * @requires ../repositories/visitRepository.js
 * @requires ../repositories/logRepository.js
 * @requires ../repositories/areaRepository.js
 * @requires ../utils/customErrors.js
 * @requires ../config/logger.js
 */

import db from "../models/index.js";
import * as visitRepository from "../repositories/visitRepository.js";
import * as logRepository from "../repositories/logRepository.js";
import * as areaRepository from "../repositories/areaRepository.js";
import {
  VisitExistsError,
  NotFoundError,
  ActiveVisitDontExistsError,
} from "../utils/customErrors.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function createVisit
 * @description Registra la entrada de un nuevo visitante en una transacción.
 * @param {object} visitData - Datos de la visita a registrar.
 * @param {object} user - El usuario (portero) que registra la entrada.
 * @param {string} ipAddress - La dirección IP del usuario.
 * @returns {Promise<object>} El objeto de la visita recién creada.
 * @throws {VisitExistsError} Si ya existe una visita activa para la misma identificación.
 * @throws {NotFoundError} Si el ID de área proporcionado no es válido.
 */
export const createVisit = async (visitData, user, ipAddress) => {
  return db.sequelize.transaction(async (t) => {
    const { identificacion, id_area, ...restOfData } = visitData;

    // 1. Verificar que no exista una visita activa para la misma identificación.
    const activeVisit = await visitRepository.findActiveByIdentification(
      identificacion,
      { transaction: t }
    );
    if (activeVisit) {
      logger.warn(
        { userId: user.id_usuario, visitorId: identificacion },
        "Intento de registrar una visita duplicada activa."
      );
      throw new VisitExistsError();
    }

    // 2. Verificar que el área de destino exista.
    const areaExists = await areaRepository.findById(id_area, {
      transaction: t,
    });
    if (!areaExists) {
      logger.warn(
        { userId: user.id_usuario, areaId: id_area },
        "Intento de registrar visita a un área inexistente."
      );
      throw new NotFoundError(`El área con ID ${id_area} no existe.`);
    }

    // 3. Preparar y crear el registro de la visita.
    const visitForDb = {
      ...restOfData,
      identificacion,
      id_area,
      id_usuario_entrada: user.id_usuario,
      fecha_entrada: new Date(),
      estado: true, // Se establece explícitamente el estado activo.
    };

    const newVisit = await visitRepository.create(visitForDb, {
      transaction: t,
    });

    // 4. Registrar la acción en el log.
    await logRepository.create(
      {
        accion: "REGISTRAR_ENTRADA_VISITA",
        id_usuario: user.id_usuario,
        descripcion: `Se registró la entrada del visitante '${newVisit.nombre_visitante}' (ID Visita: ${newVisit.id_visita}).`,
        ip_usuario: ipAddress,
        id_visita: newVisit.id_visita, // Enlazamos el log con la visita.
      },
      { transaction: t }
    );

    logger.info(
      { userId: user.id_usuario, visitId: newVisit.id_visita },
      "Nueva visita registrada exitosamente."
    );

    return newVisit;
  });
};

/**
 * @async
 * @function updateVisitExit
 * @description Registra la salida de una visita activa en una transacción.
 * @param {number} visitId - El ID de la visita a finalizar.
 * @param {object} user - El usuario (portero) que registra la salida.
 * @param {string} ipAddress - La dirección IP del usuario.
 * @returns {Promise<object>} El objeto de la visita actualizada.
 * @throws {ActiveVisitDontExistsError} Si la visita no se encuentra o ya está finalizada.
 */
export const updateVisitExit = async (visitId, user, ip_usuario) => {
  return db.sequelize.transaction(async (t) => {
    // 1. Buscar la visita para asegurar que existe y está activa.
    const visitDb = await visitRepository.findById(visitId, { transaction: t });

    if (!visitDb || !visitDb.estado) {
      logger.warn(
        { userId: user.id_usuario, visitId },
        "Intento de finalizar una visita inexistente o ya finalizada."
      );
      throw new ActiveVisitDontExistsError();
    }

    // 2. Preparar y ejecutar la actualización.
    const updateData = {
      fecha_salida: new Date(),
      estado: false,
      id_usuario_salida: user.id_usuario,
    };

    const updatedVisit = await visitRepository.update(visitId, updateData, {
      transaction: t,
    });

    // 3. Registrar la acción en el log.
    await logRepository.create(
      {
        accion: "REGISTRAR_SALIDA_VISITA",
        id_usuario: user.id_usuario,
        descripcion: `Se registró la salida del visitante '${visitDb.nombre_visitante}' (ID Visita: ${visitId}).`,
        ip_usuario: ip_usuario,
        id_visita: visitId, // Enlazamos el log con la visita.
      },
      { transaction: t }
    );

    logger.info(
      { userId: user.id_usuario, visitId },
      "Salida de visita registrada exitosamente."
    );

    return updatedVisit;
  });
};
