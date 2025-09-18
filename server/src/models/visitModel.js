import { getPool } from "../config/db.config.js";

export const findActiveVisitById = async (identificacion) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = 'SELECT * FROM visitas WHERE identificacion = ? AND estado = true';
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
    const pool = getPool();
    connect = await pool.getConnection();
    const query  = 'SELECT * FROM areas WHERE id_area = ?';
    const rows = await connect.query(query, [id_area]);
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
    const pool = getPool();
    
    connect = await pool.getConnection();

    await connect.beginTransaction()

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
      ip_usuario
    } = visitData;

    const query = `
      INSERT INTO visitas(nombre_visitante, telefono, identificacion, id_tipo_identificacion, empresa, nombre_destinatario, 
      id_area, motivo, observaciones, fecha_entrada, id_usuario_entrada)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
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
      id_usuario
    ]);

    if (!rows || rows.affectedRows === 0) {
      return null;
    }

    const queryLogs = `
      INSERT INTO logs (id_usuario, accion, descripcion, ip_usuario) 
      VALUES (?, ?, ?, ?)
    `;

    const logs = await connect.query(queryLogs, [
      id_usuario, 
      'GENERAR UNA VISITA NUEVA',
      'El usuario generó una visita nueva en la aplicación',
      ip_usuario
    ]);

    if (!logs || logs.affectedRows === 0) {
      return null
    }

    await connect.commit();

    return rows;
  } catch (error) {
    if (connect) {
      await connect.rollback();
    }
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
}

export const updateVisitExit = async (visitData) => {
  const { visitId, id_usuario, ip_usuario } = visitData;
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    await connect.beginTransaction();

    const query = `
      UPDATE visitas SET fecha_salida = NOW(), estado = false, id_usuario_salida = ? WHERE id_visita = ? AND estado = true
    `;

    const rows = await connect.query(query, [id_usuario, visitId])

    if (!rows || rows.affectedRows === 0) {
      return null;
    }

    const queryLogs = `
      INSERT INTO logs (id_usuario, accion, descripcion, ip_usuario) 
      VALUES (?, ?, ?, ?)
    `;

    const logs = await connect.query(queryLogs, [
      id_usuario, 
      'FINALIZAR UNA VISITA ACTIVA',
      'El usuario dió como terminada una visita activa en la aplicación',
      ip_usuario
    ]);
    
    if (!logs || logs.affectedRows === 0) {
      return null;
    }

    await connect.commit();

    return rows;
  } catch (error) {
    if (connect) {
      await connect.rollback();
    }
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
}