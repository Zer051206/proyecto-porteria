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
 * @returns {Promise<Array<object>>} Un array con los nuevos paquetes creados.
 * @throws {DuplicateError} Si uno de los números de guía ya existe para el mismo tipo de operación.
 */
export const createPackage = async (packageData) => {
  return db.sequelize.transaction(async (t) => {
    const { guia, tipo_operacion, id_usuario, ip_usuario, ...restOfData } =
      packageData;

    // 1. Verificación de Lógica de Negocio: Guía duplicada
    if (guia) {
      const existingPackage = await packageRepository.findByGuide(
        guia,
        tipo_operacion,
        { transaction: t }
      );
      if (existingPackage) {
        logger.warn(
          { userId: id_usuario, guide: guia, operation: tipo_operacion },
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
      guia: guia,
      tipo_operacion: tipo_operacion,
    };

    if (tipo_operacion === "recibir") {
      packageForDb.id_usuario_recibir = id_usuario;
      packageForDb.fecha_recibido = new Date();
    } else if (tipo_operacion === "enviar") {
      packageForDb.id_usuario_enviar = id_usuario;
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
        id_usuario: id_usuario,
        descripcion: logDescription,
        ip_usuario: ip_usuario,
        id_paquete: newPackage.id_paquete,
      },
      { transaction: t }
    );

    return newPackage;
  });
};

/**
 * @async
 * @function getRecentPackages
 * @description Obtiene los últimos N logs relacionados con paquetes ('RECIBIR_PAQUETE', 'ENVIAR_PAQUETE'),
 * aplicando el filtro de usuario directamente si el rol es 'portero'. Llama al repositorio de logs genérico `findRecent`.
 * @param {object} user - Objeto del usuario autenticado (con id_usuario y rol).
 * @param {number} limit - El número máximo de logs a obtener.
 * @returns {Promise<Array<object>>} Un array con los logs recientes encontrados (incluyendo datos asociados),
 * o un array vacío si no se encuentran o el rol no es válido.
 * @throws {Error} Si ocurre un error durante la consulta a la base de datos.
 */
export const getRecentPackages = async (user, limit) => {
  try {
    // Define las asociaciones a incluir en la consulta
    const includeOptions = [
      {
        model: db.Package,
        required: true, // INNER JOIN
        include: [
          {
            model: db.PackageType,
            attributes: ["descripcion"],
          },
          { model: db.Area, attributes: ["nombre_area"] },
        ],
      },
      {
        model: db.User,
        attributes: ["id_usuario", "nombre", "apellido", "rol"],
      },
    ];

    // Define las condiciones base de la consulta
    const baseWhere = {
      accion: {
        [db.Sequelize.Op.in]: ["RECIBIR_PAQUETE", "ENVIAR_PAQUETE"],
      },
      id_paquete: { [db.Sequelize.Op.ne]: null },
    };

    let queryOptions = {
      limit: limit,
      order: [["fecha_log", "DESC"]], // Ordenar por fecha del log
      include: includeOptions,
      where: baseWhere, // Inicia con las condiciones base
    };

    // Aplica el filtro de usuario SI es portero
    if (user.rol === "portero") {
      queryOptions.where.id_usuario = user.id_usuario; // Añade la condición al 'where'
    } else if (user.rol !== "admin") {
      // Si no es admin ni portero, no debería ver nada (o manejar según tu lógica)
      logger.warn(
        `Usuario con rol '${user.rol}' intentó acceder a paquetes recientes.`
      );
      return []; // Devuelve vacío si el rol no está permitido
    }
    // Si es admin, no se añade filtro de id_usuario, usa solo baseWhere

    // Llama a la función genérica del repositorio pasando todas las opciones construidas
    const recentLogs = await logRepository.findRecent(queryOptions);

    logger.info(
      `Se obtuvieron ${recentLogs.length} logs recientes de paquetes para el usuario ${user.id_usuario} (${user.rol}).`
    );
    return recentLogs;
  } catch (error) {
    logger.error(
      { userId: user.id_usuario, limit: limit, error: error.message },
      "Error al obtener logs recientes de paquetes en el servicio."
    );
    throw error; // Relanza el error
  }
};
