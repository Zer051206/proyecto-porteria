/**
 * @file visitModel.js
 * @module visitModel
 * @description Módulo de modelos para la gestión de Visitas. Incluye funciones para buscar visitas activas
 * por identificación o ID, buscar áreas, registrar nuevas visitas (entrada), y actualizar
 * el registro al momento de la salida, todo manejando transacciones y logs.
 */
import { getPool } from "../config/db.config.js";
import { DatabaseConnectionError } from "../utils/customErrors.js";

/**
 * @async
 * @function findActiveVisitByIdentificacion
 * @description Busca una visita activa (`estado = true`) utilizando la identificación del visitante.
 * @param {string} identificacion - El número de identificación del visitante.
 * @returns {Promise<object | null>} Promesa que resuelve con el objeto de la visita activa o null si no se encuentra.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta.
 */
export const findActiveVisitByIdentificacion = async (identificacion) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query =
      "SELECT * FROM visitas WHERE identificacion = ? AND estado = true";
    const rows = await connect.query(query, [identificacion]);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar encontrar la visita activa: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function findActiveVisitByVisitId
 * @description Busca una visita activa (`estado = true`) utilizando el ID de la visita.
 * @param {number} visitId - El ID interno de la visita.
 * @returns {Promise<object | null>} Promesa que resuelve con el objeto de la visita activa o null si no se encuentra.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta.
 */
export const findActiveVisitByVisitId = async (visitId) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = "SELECT * FROM visitas WHERE id_visita = ? AND estado = true";
    // Desestructuramos para obtener solo las filas
    const rows = await connect.query(query, [visitId]);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar encontrar la visita activa: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function findAreaById
 * @description Busca una única área por su ID.
 * @param {number} id_area - El ID del área a buscar.
 * @returns {Promise<object | null>} Promesa que resuelve con el objeto del área o null si no se encuentra.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta.
 */
export const findAreaById = async (id_area) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = "SELECT * FROM areas WHERE id_area = ?";
    const rows = await connect.query(query, [id_area]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar encontrar el area: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function createVisit
 * @description Registra una nueva entrada de visita en una transacción.
 * Incluye la inserción en la tabla `visitas` y el registro de la acción en la tabla `logs`.
 * @param {object} visitData - Objeto con todos los datos necesarios para la visita, incluyendo `id_usuario` e `ip_usuario`.
 * @returns {Promise<number>} Promesa que resuelve con el `insertId` (ID de la nueva visita).
 * @throws {DatabaseConnectionError} Si falla alguna parte de la transacción (inserción, log, o commit/rollback).
 */
export const createVisit = async (visitData) => {
  let connect;
  try {
    const pool = getPool();

    connect = await pool.getConnection();

    await connect.beginTransaction();

    const {
      nombre_visitante,
      telefono,
      identificacion,
      id_tipo_identificacion,
      empresa = null,
      nombre_destinatario,
      id_area,
      motivo,
      observaciones = null,
      id_usuario,
      ip_usuario,
      path_firma,
    } = visitData;

    // 1. Inserción de la nueva visita
    const query = `
      INSERT INTO visitas(nombre_visitante, telefono, identificacion, id_tipo_identificacion, empresa, nombre_destinatario, 
      id_area, motivo, observaciones, fecha_entrada, id_usuario_entrada, path_firma) 	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
    `;

    const rows = await connect.query(query, [
      nombre_visitante,
      telefono,
      identificacion,
      id_tipo_identificacion,
      empresa,
      nombre_destinatario,
      id_area,
      motivo,
      observaciones,
      id_usuario,
      path_firma,
    ]);

    if (!rows || rows.affectedRows === 0) {
      throw new DatabaseConnectionError(
        "Error el intentar crear la nueva visita"
      );
    }

    // 2. Registro de Logs
    const queryLogs = `
      INSERT INTO logs (id_usuario, accion, descripcion, ip_usuario) 
      VALUES (?, ?, ?, ?)
    `;

    const logs = await connect.query(queryLogs, [
      id_usuario,
      "GENERAR UNA VISITA NUEVA",
      "El usuario generó una visita nueva en la aplicación",
      ip_usuario,
    ]);

    if (!logs || logs.affectedRows === 0) {
      throw new DatabaseConnectionError(
        // Nota: Se lanza la excepción aquí para forzar el rollback
        `Error en la base de datos al registrar la accion del usuario para la visita.`
      );
    }

    // 3. Commit de la transacción
    await connect.commit();

    return rows.insertId;
  } catch (error) {
    if (connect) {
      await connect.rollback();
    }
    throw new DatabaseConnectionError(
      `Error en la base de datos al registrar la visita: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function updateVisitExit
 * @description Marca una visita activa como finalizada (`estado = false`), registrando la fecha de salida (`fecha_salida = NOW()`).
 * Ejecuta una **transacción** que incluye la actualización y el registro de la acción en `logs`.
 * @param {object} visitData - Objeto con `visitId`, `id_usuario` e `ip_usuario`.
 * @returns {Promise<boolean>} Promesa que resuelve a `true` si la actualización fue exitosa.
 * @throws {DatabaseConnectionError} Si la visita no existe, no está activa, o si falla la transacción/log.
 */
export const updateVisitExit = async (visitData) => {
  const { visitId, id_usuario, ip_usuario } = visitData;
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    await connect.beginTransaction();

    // 1. Actualización de la visita (salida)
    const query = `
      UPDATE visitas SET fecha_salida = NOW(), estado = false, id_usuario_salida = ? WHERE id_visita = ? AND estado = true
    `;

    const rows = await connect.query(query, [id_usuario, visitId]);

    if (!rows || rows.affectedRows === 0) {
      throw new DatabaseConnectionError(
        "Error al intentar actualizar la salida del visitante"
      );
    }

    // 2. Registro de Logs
    const queryLogs = `
      INSERT INTO logs (id_usuario, accion, descripcion, ip_usuario) 
      VALUES (?, ?, ?, ?)
    `;

    const logs = await connect.query(queryLogs, [
      id_usuario,
      "FINALIZAR UNA VISITA ACTIVA",
      "El usuario dió como terminada una visita activa en la aplicación",
      ip_usuario,
    ]);

    if (!logs || logs.affectedRows === 0) {
      throw new DatabaseConnectionError(
        "Error al registrar la accion del usuario."
      );
    }

    // 3. Commit de la transacción
    await connect.commit();

    return true;
  } catch (error) {
    if (connect) {
      await connect.rollback();
    }
    throw new DatabaseConnectionError(
      `Error en la base de datos al actualizar la salida del visitante: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};
