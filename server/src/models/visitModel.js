import pool from "../config/db.config"

export const findActiveVisitById = async (identificacion) => {
  let connect;
  try {
    connect = await pool.getConnection();
    const query = 'SELECT * FROM visitas WHERE id_visitante = ? AND estado === true';
    const rows = await connect.query(query, [identificacion]);
    
    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
}

export const findAreaById = async (id_area) => {
  let connect;
  try {
    connect = await pool.getConnection();
    const query  = 'SELECT * FROM areas WHERE id_area = ?';
    const rows = connect.query(query, [id_area]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
}

export const createVisit = async (visitData) => {
  let connect;
  try {
    connect = pool.getConnection();
    const {
      nombre_visitante, 
      telefono, 
      identificacion,
      id_tipo_identificacion,
      empresa = null,
      nombre_destinatario,
      id_area,
      motivo,
      observaciones = null
    } = visitData;

    const query = `
    INSERT INTO visitas(nombre_visitante, telefono, identificacion, id_tipo_identificacion, empresa, nombre_destinatario, 
    id_area, motivo, observaciones, fecha_entrada)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const rows = connect.query(query, [
      nombre_visitante, 
      telefono,
      identificacion,
      id_tipo_identificacion,
      empresa,
      nombre_destinatario,
      id_area,
      motivo,
      observaciones
    ]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
}

export const updateVisitExit = async (visitId) => {
  let connect;
  try {
    connect = pool.getConnection();

    const query = 'UPDATE visitas SET fecha_salida = NOW(), estado = false WHERE id_visita = ? AND estado = true';

    const rows = await connect.query(query, [visitId])

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
}