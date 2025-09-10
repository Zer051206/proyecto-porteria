import pool from "../config/db.config.js";

export const fetchAreas = async () => {
  let connect;
  try {
    connect = await pool.getConnection();

    const query = 'SELECT * FROM areas';
    const rows = await connect.query(query);

    if (rows.length === 0) {
      return null;
    }

    return rows;
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
};

export const fetchTiposIdentificacion = async () => {
  let connect;
  try {
    connect = await pool.getConnection();
    const query = 'SELECT * FROM tipos_identificacion';
    const rows = await connect.query(query);

    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
};

export const fetchActiveVisits = async () => {
  let connect;
  try {
    connect = pool.getConnection();
    const query = `
      SELECT v.id_visita, v.nombre_visitante, v.telefono, v.identificacion,
             v.empresa, v.nombre_destinatario, a.nombre_area,v.fecha_entrada,
      FROM visitas v JOIN areas a ON v.id_area = a.id_area WHERE v.estado = true    
    `
    const rows = (await connect).query(query);
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
};

export const fetchTiposPaquetes = async () => {
  let connect;
  try {
    connect = await pool.getConnection();
    const query = `SELECT * FROM tipos_paquetes`;
    const rows = await connect.query(query);
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release;  
  }
};