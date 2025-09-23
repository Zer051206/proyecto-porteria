import { getPool } from "../config/db.config.js";
import { DatabaseConnectionError } from "../utils/customErrors.js";

export const findByEmail = async (email) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    const query = "SELECT * FROM usuarios WHERE correo=?";
    const rows = await connect.query(query, [email]);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error al buscar al usuario por correo: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

export const findById = async (id) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `SELECT * FROM usuarios WHERE id_usuario = ?`;
    const rows = await connect.query(query, [id]);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error al buscar al usuario por ID: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

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
      rol = "portero",
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

    if (result.affectedRows === 0) {
      throw new DatabaseConnectionError("No se pudo registrar el usuario.");
    }

    return { id_usuario: result.insertId.toString(), ...userData };
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al crear el usuario ${error.message}`
    );
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
      nombre: "nombre",
      apellido: "apellido",
      correo: "correo",
      contrasena_hash: "contrasena_hash",
      id_oauth: "id_oauth",
      proveedor_oauth: "proveedor_oauth",
      rol: "rol",
      activo: "activo",
      ultimo_login: "ultimo_login",
    };

    const keysToUpdate = Object.keys(updateData).filter(
      (key) => columnMapping[key]
    );

    if (keysToUpdate.length === 0) {
      throw new Error("No hay datos válidos para actualizar.");
    }

    const setClause = keysToUpdate
      .map((key) => `${columnMapping[key]} = ?`)
      .join(", ");

    const updateValues = keysToUpdate.map((key) => updateData[key]);

    updateValues.push(userId);

    const query = `
      UPDATE usuarios SET ${setClause}, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id_usuario = ?
    `;

    const result = await connect.query(query, updateValues);

    if (result.affectedRows === 1) {
      return { id_usuario: userId, ...updateData };
    } else {
      throw new DatabaseConnectionError(
        "No se pudo actualizar el usuario. El usuario no existe o los datos son los mismos"
      );
    }
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al actualizar el usuario ${error.message}`
    );
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
    `;

    const rows = await connect.query(query, [userId]);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al verificar el estado del usuario: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

export const updateLastLogin = async (userId) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      UPDATE usuarios 
      SET ultimo_login = NOW() 
      WHERE id_usuario = ?
    `;
    const result = await connect.query(query, [userId]);

    if (result.affectedRows === 0) {
      throw new DatabaseConnectionError(
        "No se pudo registrar la fecha del último login."
      );
    }
    return true;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al actualizar el ultimo login del usuario: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};
