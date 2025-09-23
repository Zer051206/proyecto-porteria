import { getPool } from "../config/db.config.js";
import { DatabaseConnectionError } from "../utils/customErrors.js";

export const fetchAreas = async () => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    const query = "SELECT * FROM areas";
    const rows = await connect.query(query);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de al intentar obtener las areas: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

export const fetchTiposIdentificacion = async () => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = "SELECT * FROM tipos_identificacion";
    const rows = await connect.query(query);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de al intentar obtener los tipos de identificacion: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

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

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de al intentar obtener las visitas activas: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

export const fetchTiposPaquetes = async () => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `SELECT * FROM tipos_paquetes`;
    const rows = await connect.query(query);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de al intentar obtener los tipos de paquetes: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

export const fetchVisitsHistorial = async () => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `SELECT * FROM visitas;`;
    const rows = connect.query(query);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentas obtener el historial de visitas: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};
