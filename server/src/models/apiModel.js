/**
 * @file apiModel.js
 * @module apiModel
 * @description Módulo de modelos para consultas de solo lectura de la API general,
 * incluyendo la obtención de catálogos (áreas, tipos de identificación, tipos de paquetes)
 * y el historial de visitas y paquetes.
 */
import { getPool } from "../config/db.config.js";
import { DatabaseConnectionError } from "../utils/customErrors.js";

/**
 * @async
 * @function fetchAreas
 * @description Obtiene todas las áreas registradas en la base de datos.
 * @returns {Promise<Array<object> | null>} Promesa que resuelve con un array de objetos (áreas) o null si no hay resultados.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta a la base de datos.
 */
export const fetchAreas = async () => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    const query = "SELECT * FROM areas";
    const rows = await connect.query(query);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar obtener las areas: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function fetchTiposIdentificacion
 * @description Obtiene todos los tipos de identificación válidos.
 * @returns {Promise<Array<object> | null>} Promesa que resuelve con un array de objetos (tipos de identificación) o null si no hay resultados.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta a la base de datos.
 */
export const fetchTiposIdentificacion = async () => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = "SELECT * FROM tipos_identificacion";
    const rows = await connect.query(query);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar obtener los tipos de identificacion: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function fetchActiveVisits
 * @description Obtiene un listado de todas las visitas que aún no tienen registrada su hora de salida (`estado = 1`).
 * @returns {Promise<Array<object> | null>} Promesa que resuelve con un array de visitas activas o null si no hay.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta a la base de datos.
 */
export const fetchActiveVisits = async () => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      SELECT v.id_visita, v.nombre_visitante, v.telefono, v.identificacion,
             v.empresa, v.nombre_destinatario, a.nombre_area, v.fecha_entrada
      FROM visitas v JOIN areas a ON v.id_area = a.id_area WHERE v.estado = 1 
    `;
    const rows = await connect.query(query);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar obtener las visitas activas: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function fetchTiposPaquetes
 * @description Obtiene todos los tipos de paquetes disponibles para clasificación.
 * @returns {Promise<Array<object> | null>} Promesa que resuelve con un array de objetos (tipos de paquetes) o null si no hay resultados.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta a la base de datos.
 */
export const fetchTiposPaquetes = async () => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `SELECT * FROM tipos_paquetes`;
    const rows = await connect.query(query);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar obtener los tipos de paquetes: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function fetchPackagesHistorial
 * @description Obtiene el historial completo de paquetes, aplicando un filtro de búsqueda si se proporciona.
 * La búsqueda incluye guía, tipo de operación, área, tipo de paquete, destinatario, remitente y fechas.
 * @param {string | undefined} searchTerm - El término de búsqueda opcional.
 * @returns {Promise<Array<object> | null>} Promesa que resuelve con un array de paquetes históricos o null si no hay resultados.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta a la base de datos.
 */
export const fetchPackagesHistorial = async (searchTerm) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    // Consulta base
    let query = `
      SELECT p.*, a.nombre_area, tp.descripcion FROM paquetes p 
      JOIN areas a ON p.id_area=a.id_area 
      JOIN tipos_paquetes tp ON p.id_tipo_paquete=tp.id_tipo_paquete
    `;
    let params = [];

    // Si hay un término de búsqueda, añade la cláusula WHERE
    if (searchTerm) {
      const likeTerm = `%${searchTerm}%`;
      query += ` WHERE (
        LOWER(p.guia) LIKE LOWER(?)
        OR LOWER(p.tipo_operacion) LIKE LOWER(?)
        OR LOWER(a.nombre_area) LIKE LOWER(?)
        OR LOWER(tp.descripcion) LIKE LOWER(?) 
        OR LOWER(p.nombre_destinatario) LIKE LOWER(?)
        OR LOWER(p.nombre_remitente) LIKE LOWER(?)
        OR DATE_FORMAT(p.fecha_recibido, '%e/%c/%Y') LIKE ?
        OR DATE_FORMAT(p.fecha_envio, '%e/%c/%Y') LIKE ?
        OR DATE_FORMAT(p.fecha_recibido, '%H:%i') LIKE ?
        OR DATE_FORMAT(p.fecha_envio, '%H:%i') LIKE ?
      )`;

      params = [
        likeTerm,
        likeTerm,
        likeTerm,
        likeTerm,
        likeTerm,
        likeTerm,
        likeTerm, // Fechas
        likeTerm,
        likeTerm, // Horas
        likeTerm,
      ];
    }

    const rows = await connect.query(query, params);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar obtener el historial de paquetes: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function fetchVisitsHistorial
 * @description Obtiene el historial completo de visitas, aplicando un filtro de búsqueda si se proporciona.
 * La búsqueda incluye visitante, tipo de identificación, área, identificación, destinatario y fechas.
 * @param {string | undefined} searchTerm - El término de búsqueda opcional.
 * @returns {Promise<Array<object> | null>} Promesa que resuelve con un array de visitas históricas o null si no hay resultados.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta a la base de datos.
 */
export const fetchVisitsHistorial = async (searchTerm) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    // Consulta base
    let query = `
      SELECT v.*, a.nombre_area, tii.descripcion FROM visitas v 
      JOIN areas a ON v.id_area=a.id_area 
      JOIN tipos_identificacion tii ON v.id_tipo_identificacion=tii.id_tipo_identificacion
    `;
    let params = [];

    // Si hay un término de búsqueda, añade la cláusula WHERE
    if (searchTerm) {
      // Se utiliza OR para buscar coincidencias en múltiples campos
      query += ` WHERE (
               LOWER(v.nombre_visitante) LIKE LOWER(?) 
               OR LOWER(tii.descripcion) LIKE LOWER(?)
               OR LOWER(a.nombre_area) LIKE LOWER(?)
               OR LOWER(v.identificacion) LIKE LOWER(?) 
               OR LOWER(v.nombre_destinatario) LIKE LOWER(?)
               OR DATE_FORMAT(v.fecha_entrada, '%e/%c/%Y') LIKE ? 
               OR DATE_FORMAT(v.fecha_salida, '%e/%c/%Y') LIKE ?
               OR DATE_FORMAT(v.fecha_entrada, '%H:%i') LIKE ? 
               OR DATE_FORMAT(v.fecha_salida, '%H:%i') LIKE ?
             )`;
      const likeTerm = `%${searchTerm}%`;
      params = [
        likeTerm,
        likeTerm,
        likeTerm,
        likeTerm,
        likeTerm,
        likeTerm, // Fechas
        likeTerm,
        likeTerm, // Horas
        likeTerm,
      ];
    }

    const rows = await connect.query(query, params);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar obtener el historial de visitas: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};
