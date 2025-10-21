/**
 * @file packageService.js
 * @module Services
 * @description Capa de servicio para la gestión de la lógica de negocio de los paquetes.
 * Se encarga de la creación (recepción y envío) de paquetes, asegurando la integridad de los datos
 * a través de transacciones y registrando las acciones para auditoría.
 * @requires ../models/index.js
 * @requires ../repositories/packageRepository.js
 * @requires ../repositories/logRepository.js
 * @requires ../utils/customErrors.js
 * @requires ../config/logger.js
 */

import db from "../models/index.js";
import * as packageRepository from "../repositories/packageRepository.js";
import * as logRepository from "../repositories/logRepository.js";
import { DuplicateError, BadRequestError } from "../utils/customErrors.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function createPackage
 * @description Crea uno o más registros de paquetes (de tipo 'enviar' o 'recibir') en una transacción.
 * Verifica la unicidad del número de guía para cada tipo de operación.
 * @param {Array<object>} packagesData - Array de objetos con los datos de los paquetes a crear.
 * @param {object} user - El objeto del usuario autenticado que realiza la acción.
 * @param {string} ipAddress - La dirección IP del usuario.
 * @returns {Promise<Array<object>>} Un array con los nuevos paquetes creados.
 * @throws {DuplicateError} Si uno de los números de guía ya existe para el mismo tipo de operación.
 */
export const createPackage = async (packagesData, user, ip_usuario) => {
  return db.sequelize.transaction(async (t) => {
    const creationPromises = packagesData.map(async (packageData) => {
      const { guia, tipo_operacion, ...restOfData } = packageData;

      // 1. Verificación de Lógica de Negocio: Guía duplicada
      if (guia) {
        const existingPackage = await packageRepository.findByGuide(
          guia,
          tipo_operacion,
          { transaction: t }
        );
        if (existingPackage) {
          logger.warn(
            { userId: user.id_usuario, guide: guia, operation: tipo_operacion },
            "Intento de registrar paquete con guía duplicada."
          );
          throw new DuplicateError(
            `La guía '${guia}' ya fue registrada para la misma operación'.`
          );
        }
      }

      // 2. Preparación de los datos para la base de datos
      const packageForDb = {
        ...restOfData,
        guia,
        tipo_operacion,
      };

      if (tipo_operacion === "recibir") {
        packageForDb.id_usuario_recibir = user.id_usuario;
        packageForDb.fecha_recibido = new Date();
      } else if (tipo_operacion === "enviar") {
        packageForDb.id_usuario_enviar = user.id_usuario;
        packageForDb.fecha_envio = new Date();
      } else {
        throw new BadRequestError(
          `El tipo de operación '${tipo_operacion}' no es válido.`
        );
      }

      // 3. Creación del registro del paquete
      const newPackage = await packageRepository.create(packageForDb, {
        transaction: t,
      });

      // 4. Creación del registro de auditoría (log)
      const logAction =
        tipo_operacion === "recibir" ? "RECIBIR_PAQUETE" : "ENVIAR_PAQUETE";
      const logDescription = `Se registró un paquete (${tipo_operacion}) con guía '${
        guia || "N/A"
      }' (ID: ${newPackage.id_paquete}).`;

      await logRepository.create(
        {
          accion: logAction,
          id_usuario: user.id_usuario,
          descripcion: logDescription,
          ip_usuario: ip_usuario,
          id_paquete: newPackage.id_paquete, // Se enlaza el log con el paquete
        },
        { transaction: t }
      );

      return newPackage;
    });

    const createdPackages = await Promise.all(creationPromises);
    logger.info(
      { userId: user.id_usuario, count: createdPackages.length },
      `${createdPackages.length} paquete(s) creado(s) exitosamente.`
    );
    return createdPackages;
  });
};
