import { getPool } from "../config/db.config.js";

const pool = getPool();

export const findPackageGuideReceive = async (guia) => {
  let connect;
  try {
    connect = await pool.getConnection();
    const query = 'SELECT * FROM paquetes WHERE guia = ? AND tipo_operacion = "recibir"';
    const rows = await connect.query(query, [guia]);
    if (rows.length === 0) {
      return null;  
    }
    return rows[0];
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
};

export const findPackageGuideSend = async (guia) => {
  let connect;
  try {
    connect = await pool.getConnection();
    const query = 'SELECT * FROM paquetes WHERE guia = ? AND tipo_operacion = "enviar"';
    const rows = await connect.query(query, [guia]);
    if (rows.length === 0) {
      return null;  
    }
    return rows[0];
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
};

export const createReceivedPackage = async (validatePackageData) => {
  let connect;
  try {
    connect = await pool.getConnection();
    const {
      id_tipo_paquete,
      guia = null,
      nombre_destinatario,
      id_area,
      empresa_transporte = null,
      mensajero_nombre = null,
      observaciones = null
    } = validatePackageData;
    const query = `
      INSERT INTO paquetes (id_tipo_paquete, tipo_operacion, guia, nombre_destinatario, id_area, 
                  empresa_transporte, mensajero_nombre, fecha_entrada, observaciones)
      VALUES (?, 'recibir', ?, ?, ?, ?, ?, NOW(), ?)
    `
    const rows = await connect.query(query, [
      id_tipo_paquete,
      guia,
      nombre_destinatario,
      id_area,
      empresa_transporte,
      mensajero_nombre,
      observaciones
    ])

    if (rows.affectedRows === 0) {
      throw new Error('No se pudo registrar el paquete.');
    }

    return rows;

  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
};

export const createSentPackage = async (validatePackageData) => {
  let connect;
  try {
    connect = await pool.getConnection();
    
    const {
      id_tipo_paquete,
      guia = null,
      nombre_destinatario,
      id_area,
      destino_salida,
      empresa_transporte = null,
      mensajero_nombre = null,
      observaciones = null
    } = validatePackageData;
    
    const query = `
      INSERT INTO paquetes (id_tipo_paquete, tipo_operacion, guia, nombre_destinatario, id_area, 
                  destino_salida, empresa_transporte, mensajero_nombre, fecha_salida, observaciones)
      VALUES (?, 'enviar', ?, ?, ?, ?, ?, ?, NOW(), ?)
    `
    const rows = connect.query(query, [
      id_tipo_paquete,
      guia,
      nombre_destinatario,
      id_area,
      destino_salida,
      empresa_transporte,
      mensajero_nombre,
      observaciones
    ])

    if (rows.affectedRows === 0) {
      throw new Error('No se pudo registrar el paquete.');
    }
    
    return rows;
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
}