import { getPool } from "../config/db.config.js";
import { DatabaseConnectionError } from "../utils/customErrors.js";

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

export const findActiveVisitByVisitId = async (visitId) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = "SELECT * FROM visitas WHERE id_visita = ? AND estado = true";
    // Desestructuramos para obtener solo las filas
    const rows = await connect.query(query, [visitId]);

    console.log(rows[0]);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar encontrar la visita activa: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

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

    const query = `
      INSERT INTO visitas(nombre_visitante, telefono, identificacion, id_tipo_identificacion, empresa, nombre_destinatario, 
      id_area, motivo, observaciones, fecha_entrada, id_usuario_entrada, path_firma)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
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
        `Error en la base de datos al registrar la visita: ${error.message}`
      );
    }

    await connect.commit();

    return rows.insertId;
  } catch (error) {
    if (connect) {
      await connect.rollback();
    }
    throw new DatabaseConnectionError(
      "Error en la base de datos al registrar la visita." + error.message
    );
  } finally {
    if (connect) connect.release();
  }
};

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

    const rows = await connect.query(query, [id_usuario, visitId]);

    if (!rows || rows.affectedRows === 0) {
      throw new DatabaseConnectionError(
        "Error al intentar actualizar la salida del visitante"
      );
    }

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
