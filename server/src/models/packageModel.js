import { getPool } from "../config/db.config.js";

export const findPackageGuideReceive = async (guia) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    const query = 'SELECT 1 FROM paquetes WHERE guia = ? AND tipo_operacion = "recibir" LIMIT 1';
    const rows = await connect.query(query, [guia]);

    return rows.length > 0;
  } catch (error) {
    throw error;
  } finally {
    if (connect) connect.release();
  }
};

export const findPackageGuideSend = async (guia) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    
    if (guia === null || guia === undefined){
      return false;
    }
    const query = 'SELECT 1 FROM paquetes WHERE guia = ? AND tipo_operacion = "enviar" LIMIT 1';
    const rows = await connect.query(query, [guia]);

    return rows.length > 0;
  } catch (error) {
    throw error;
  } finally {
    if (connect) connect.release();
  }
};

export const createReceivedPackage = async (packageData) => {
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
      ip_usuario
    } = packageData;

    const query = `
      INSERT INTO paquetes (id_tipo_paquete, tipo_operacion, guia, nombre_destinatario, id_area, 
                  empresa_transporte, mensajero_nombre, fecha_entrada, observaciones, id_usuario_recibir)
      VALUES (?, 'recibir', ?, ?, ?, ?, ?, NOW(), ?, ?)
    `
    const rows = await connect.query(query, [
      id_tipo_paquete,
      guia,
      nombre_destinatario,
      id_area,
      empresa_transporte,
      mensajero_nombre,
      observaciones,
      id_usuario
    ])

    if (!rows || rows[0].affectedRows === 0) {
      throw new Error('No se pudo registrar el paquete.');
    }
  
    const queryLogs = `
      INSERT INTO logs (id_usuario, accion, descripcion, ip_usuario) 
      VALUES (?, ?, ?, ?)
    `;

    const logs = await connect.query(queryLogs, [
      id_usuario, 
      'RECIBIR UN PAQUETE', 
      'El usuario generó un paquete recibido desde la aplicación', 
      ip_usuario
    ]);
    
    if (!logs || logs[0].affectedRows === 0) {
      return null
    }

    await connect.commit();

    return rows[0];
  } catch (error) {
    if (connect) {
      await connect.rollback();
    }
    throw new Error('Error en la consulta a la base de datos: ' + error.message)
  } finally {
    if (connect) connect.release();
  }
};

export const createSentPackage = async (packageData) => {
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
      destino_salida,
      empresa_transporte = null,
      mensajero_nombre = null,
      observaciones = null,
      id_usuario,
      ip_usuario
    } = packageData;
    
    const query = `
      INSERT INTO paquetes (id_tipo_paquete, tipo_operacion, guia, nombre_destinatario, id_area, 
                  destino_salida, empresa_transporte, mensajero_nombre, fecha_salida, observaciones, id_usuario_enviar)
      VALUES (?, 'enviar', ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
    `
    const rows = await connect.query(query, [
      id_tipo_paquete,
      guia,
      nombre_destinatario,
      id_area,
      destino_salida,
      empresa_transporte,
      mensajero_nombre,
      observaciones,
      id_usuario
    ])

    if (!rows || rows[0].affectedRows === 0) {
      throw new Error('No se pudo registrar el paquete.');
    }

    const queryLogs = `
      INSERT INTO logs (id_usuario, accion, descripcion, ip_usuario) 
      VALUES (?, ?, ?, ?)
    `;

    const logs = await connect.query(queryLogs, [
      id_usuario, 
      'ENVIAR UN PAQUETE', 
      'El usuario generó un envío de un paquete desde la aplicación', 
      ip_usuario
    ]);
    
    if (!logs || logs[0].affectedRows === 0) {
      return null
    }
    
    await connect.commit();

    return rows[0];
  } catch (error) {
    if (connect) {
      await connect.rollback;
    }
    throw new Error('Error en la consulta a la base de datos: ' + error.message)
  } finally {
    if (connect) connect.release();
  }
}