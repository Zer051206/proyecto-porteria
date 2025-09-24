import { getPool } from "../config/db.config.js";
import { DatabaseConnectionError } from "../utils/customErrors.js";

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

    return rows.length > 0 ? rows : null;
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

    return rows.length > 0 ? rows : null;
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

    return rows.length > 0 ? rows : null;
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
    const query = `SELECT * FROM visitas`;
    const rows = await connect.query(query);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentas obtener el historial de visitas: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

export const fetchPackagesHistorial = async () => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `SELECT * FROM paquetes`;
    const rows = await connect.query(query);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentas obtener el historial de visitas: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

export const fetchPackageData = async (pkgId) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      select p.id_paquete, p.tipo_operacion, p.guia, p.nombre_destinatario, p.nombre_remitente, p.destino_salida, 
      p.empresa_transporte, p.mensajero_nombre, p.fecha_recibido, p.fecha_envio, p.observaciones, 
      a.nombre_area, tp.descripcion from paquetes p join areas a on p.id_area = a.id_area join 
      tipos_paquetes tp on p.id_tipo_paquete = tp.id_tipo_paquete where id_paquete = ?
    `;
    const rows = await connect.query(query, [pkgId]);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentas obtener el historial de visitas: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

export const fetchVisitData = async (visitId) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      select v.*, a.nombre_area, tii.descripcion from visitas v join areas a on v.id_area=a.id_area join 
      tipos_identificacion tii on v.id_tipo_identificacion=tii.id_tipo_identificacion where id_visita = ?
    `;
    const rows = await connect.query(query, [visitId]);

    return rows.length > 0 ? rows : null;
  } catch (error) {
  } finally {
    if (connect) connect.release();
  }
};
