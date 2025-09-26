/**
 * @file packageModel.js
 * @module packageModel
 * @description Módulo de modelos para la gestión de paquetes, incluyendo la verificación de guías
 * y la persistencia de datos de recepción y envío en la base de datos, manejando transacciones y logs.
 */
import { getPool } from "../config/db.config.js";
import { DatabaseConnectionError } from "../utils/customErrors.js";

/**
 * @async
 * @function findPackageGuideReceive
 * @description Busca si un número de guía ya ha sido registrado previamente con el tipo de operación 'recibir'.
 * @param {string} guia - El número de guía a buscar.
 * @returns {Promise<boolean>} Promesa que resuelve a `true` si la guía existe para una recepción, `false` en caso contrario.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta.
 */
export const findPackageGuideReceive = async (guia) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    const query =
      'SELECT 1 FROM paquetes WHERE guia = ? AND tipo_operacion = "recibir" LIMIT 1';
    const rows = await connect.query(query, [guia]);

    return rows.length > 0;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al buscar el paquete por la guia: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function findPackageGuideSend
 * @description Busca si un número de guía ya ha sido registrado previamente con el tipo de operación 'enviar'.
 * @param {string | null | undefined} guia - El número de guía a buscar.
 * @returns {Promise<boolean | null>} Promesa que resuelve a `true` si la guía existe para un envío, `false` si no existe, o `null` si la guía es nula o indefinida.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta.
 */
export const findPackageGuideSend = async (guia) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    const query =
      'SELECT 1 FROM paquetes WHERE guia = ? AND tipo_operacion = "enviar" LIMIT 1';
    const rows = await connect.query(query, [guia]);

    return rows.length > 0;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al buscar el paquete por la guia: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function createReceivePackage
 * @description Inserta un nuevo paquete con `tipo_operacion='recibir'`.
 * Ejecuta una **transacción** que incluye la inserción del paquete y el registro de la acción en la tabla `logs`.
 * @param {object} packageData - Datos del paquete, incluyendo `id_usuario` e `ip_usuario` para la auditoría.
 * @returns {Promise<object>} Promesa que resuelve con el resultado de la inserción del paquete.
 * @throws {DatabaseConnectionError} Si falla alguna parte de la transacción (inserción, log, o commit/rollback).
 */
export const createReceivePackage = async (packageData) => {
  let connect;
  try {
    const pool = getPool();

    connect = await pool.getConnection();

    await connect.beginTransaction();

    const {
      id_tipo_paquete,
      guia = null,
      nombre_destinatario,
      id_area,
      empresa_transporte = null,
      mensajero_nombre = null,
      observaciones = null,
      id_usuario,
      ip_usuario,
    } = packageData;

    // 1. Inserción del paquete
    const query = `
      INSERT INTO paquetes (id_tipo_paquete, tipo_operacion, guia, nombre_destinatario, id_area, 
                   empresa_transporte, mensajero_nombre, fecha_recibido, observaciones, id_usuario_recibir)
      VALUES (?, 'recibir', ?, ?, ?, ?, ?, NOW(), ?, ?)
    `;
    const rows = await connect.query(query, [
      id_tipo_paquete,
      guia,
      nombre_destinatario,
      id_area,
      empresa_transporte,
      mensajero_nombre,
      observaciones,
      id_usuario,
    ]);

    if (!rows || rows.affectedRows === 0) {
      throw new DatabaseConnectionError(
        "Error al intentar registrar el paquete recibido"
      );
    }

    // 2. Registro de Logs
    const queryLogs = `
      INSERT INTO logs (id_usuario, accion, descripcion, ip_usuario) 
      VALUES (?, ?, ?, ?)
    `;

    const logs = await connect.query(queryLogs, [
      id_usuario,
      "RECIBIR UN PAQUETE",
      "El usuario generó un paquete recibido desde la aplicación",
      ip_usuario,
    ]);

    if (!logs || logs.affectedRows === 0) {
      throw new DatabaseConnectionError(
        "Error al intentar registrar la accion del usuario."
      );
    }

    // 3. Commit de la transacción
    await connect.commit();

    return rows;
  } catch (error) {
    if (connect) {
      await connect.rollback();
    }
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar registrar el paquete recibido: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function createSentPackage
 * @description Inserta un nuevo paquete con `tipo_operacion='enviar'`.
 * Ejecuta una **transacción** que incluye la inserción del paquete y el registro de la acción en la tabla `logs`.
 * @param {object} packageData - Datos del paquete, incluyendo `id_usuario` e `ip_usuario` para la auditoría.
 * @returns {Promise<object>} Promesa que resuelve con el resultado de la inserción del paquete.
 * @throws {DatabaseConnectionError} Si falla alguna parte de la transacción (inserción, log, o commit/rollback).
 */
export const createSentPackage = async (packageData) => {
  let connect;
  try {
    const pool = getPool();

    connect = await pool.getConnection();

    await connect.beginTransaction();

    const {
      id_tipo_paquete,
      guia = null,
      nombre_remitente,
      id_area,
      destino_salida,
      empresa_transporte = null,
      mensajero_nombre = null,
      observaciones = null,
      id_usuario,
      ip_usuario,
    } = packageData;

    // 1. Inserción del paquete
    const query = `
      INSERT INTO paquetes (id_tipo_paquete, tipo_operacion, guia, nombre_remitente, id_area, 
                   destino_salida, empresa_transporte, mensajero_nombre, fecha_envio, observaciones, id_usuario_enviar)
      VALUES (?, 'enviar', ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
    `;
    const rows = await connect.query(query, [
      id_tipo_paquete,
      guia,
      nombre_remitente,
      id_area,
      destino_salida,
      empresa_transporte,
      mensajero_nombre,
      observaciones,
      id_usuario,
    ]);

    if (!rows || rows.affectedRows === 0) {
      throw new DatabaseConnectionError(
        "Error al intentar registrar el envío del paquete"
      );
    }

    // 2. Registro de Logs
    const queryLogs = `
      INSERT INTO logs (id_usuario, accion, descripcion, ip_usuario) 
      VALUES (?, ?, ?, ?)
    `;

    const logs = await connect.query(queryLogs, [
      id_usuario,
      "ENVIAR UN PAQUETE",
      "El usuario generó un envío de un paquete desde la aplicación",
      ip_usuario,
    ]);

    if (!logs || logs.affectedRows === 0) {
      throw new DatabaseConnectionError(
        "Error al intentar registrar la acción del usuario"
      );
    }

    // 3. Commit de la transacción
    await connect.commit();

    return rows;
  } catch (error) {
    if (connect) {
      await connect.rollback();
    }
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar registrar el envío del paquete: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};
