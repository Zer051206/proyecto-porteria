import { getPool } from "../config/db.config.js";

export const findByEmail = async (email) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    const query = 'SELECT * FROM usuarios WHERE correo=?';
    const results = await connect.query(query, [email]);

    const rows = results.filter(row => row && typeof row === 'object' && !row.constructor.name.includes('Meta'));
    
    if (rows && rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
};

export const findById = async (id) => {
  let connect;
  try{
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `SELECT * FROM usuarios WHERE id_usuario = ?`;
    const [rows] = await connect.query(query, [id]);
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

export const createUser = async (userData) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    const { 
      nombre, 
      apellido, 
      correo, 
      contrasena_hash = null, 
      id_oauth = null,
      proveedor_oauth = null,
      rol = 'portero',
    } = userData;

    const query = `
      INSERT INTO usuarios (nombre, apellido, correo, contrasena_hash, id_oauth, proveedor_oauth, rol, activo) 
      VALUES (?, ?, ?, ?, ?, ?, ?, false)
    `;

    const result = await connect.query(query, [
      nombre, 
      apellido, 
      correo, 
      contrasena_hash, 
      id_oauth, 
      proveedor_oauth, 
      rol,
    ]);

    return { id_usuario: result.insertId.toString(), ...userData };
  } catch (error) {
    throw new Error('Error al crear el usuario: ' + error.message)
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @function upadateUser: 
 * @description 
 * @param {String} userId 
 * @param {Object} updateData 
 * @returns 
 */

export const updateUser = async (userId, updateData) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    const columnMapping = {
      nombre: 'nombre',
      apellido: 'apellido',
      correo: 'correo',
      contrasena_hash: 'contrasena_hash',
      id_oauth: 'id_oauth',
      proveedor_oauth: 'proveedor_oauth',
      rol: 'rol',
      activo: 'activo',
      ultimo_login: 'ultimo_login'
    };

    const keysToUpdate = Object.keys(updateData).filter(key => columnMapping[key]);

    if (keysToUpdate.length === 0) {
      throw new Error('No hay datos válidos para actualizar.');
    }

    const setClause = keysToUpdate.map(key => `${columnMapping[key]} = ?`).join(', ');

    const updateValues = keysToUpdate.map(key => updateData[key]);

    updateValues.push(userId);

    const query = `
      UPDATE usuarios SET ${setClause}, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id_usuario = ?
    `;

    const [result] = await connect.query(query, updateValues);

    if (result.affectedRows === 1) {
      return { id_usuario: userId, ...updateData };
    } else {
      throw new Error('No se pudo actualizar el usuario.');
    }
  } catch (error) {
    throw new Error('Error al actualizar la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
};

export const checkIfUserIsActive = async (userId) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      SELECT activo FROM usuarios WHERE id_usuario = ?
    `

    const results = await connect.query(query, [userId]);

    const rows = results.filter(row => row && typeof row === 'object' && !row.constructor.name.includes('Meta'));
    
    if (rows && rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
};

export const updateLastLogin = async (userId) => {
  let connect; 
  try {
    const pool = getPool();
    connect = pool.getConection();
    const query = `
      UPDATE usuarios 
      SET ultimo_login = NOW() 
      WHERE id_usuario = ?
    `
    const result = connect.query(query, [userId])
    return result;
  } catch (error) {
    throw new Error('Error al actualizar el ultimo login del usuario');
  } finally {
    if (connect) connect.release();
  }
};