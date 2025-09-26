/**
 * @file userModel.js
 * @module userModel
 * @description Módulo de modelos para la gestión de usuarios, incluyendo búsqueda,
 * creación, actualización de datos y verificación del estado de la cuenta.
 */
import { getPool } from "../config/db.config.js";
import {
  DatabaseConnectionError,
  NoValidUpdateDataError,
} from "../utils/customErrors.js";

/**
 * @async
 * @function findByEmail
 * @description Busca un usuario en la base de datos utilizando su correo electrónico.
 * @param {string} email - El correo electrónico del usuario.
 * @returns {Promise<object | null>} Promesa que resuelve con el objeto del usuario o null si no se encuentra.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta.
 */
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

/**
 * @async
 * @function findById
 * @description Busca un usuario en la base de datos utilizando su ID.
 * @param {number} id - El ID del usuario.
 * @returns {Promise<object | null>} Promesa que resuelve con el objeto del usuario o null si no se encuentra.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta.
 */
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

/**
 * @async
 * @function createUser
 * @description Registra un nuevo usuario en la base de datos con valores por defecto para campos opcionales.
 * Por defecto, el usuario se crea como inactivo (`activo: false`).
 * @param {object} userData - Datos del usuario a crear. Puede incluir `contrasena_hash`, `id_oauth`, `proveedor_oauth` y `rol`.
 * @returns {Promise<object>} Promesa que resuelve con el ID generado y los datos del usuario.
 * @throws {DatabaseConnectionError} Si la inserción falla.
 */
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

    // Nota: Se devuelve el ID como string ya que `result.insertId` suele ser un BigInt o number que se maneja mejor como string en JS si se usa para IDs.
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
 * @async
 * @function updateUser
 * @description Actualiza los datos de un usuario por su ID. Genera dinámicamente la cláusula SET.
 * También actualiza automáticamente el campo `fecha_actualizacion`.
 * @param {number} userId - ID del usuario a actualizar.
 * @param {object} updateData - Objeto con los campos a actualizar (ej. { nombre: 'Nuevo Nombre', activo: 1 }).
 * @returns {Promise<object>} Promesa que resuelve con el ID del usuario y los datos que fueron actualizados.
 * @throws {Error} Si no se proporcionan campos válidos para actualizar.
 * @throws {DatabaseConnectionError} Si la actualización falla (ej. usuario no encontrado).
 */
export const updateUser = async (userId, updateData) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();

    // Mapeo para asegurar que solo se actualicen columnas válidas
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
      throw new NoValidUpdateDataError();
    }

    const setClause = keysToUpdate
      .map((key) => `${columnMapping[key]} = ?`)
      .join(", ");

    const updateValues = keysToUpdate.map((key) => updateData[key]);

    // Añadir el userId al final de los valores para la cláusula WHERE
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
    // Si el error es una instancia de Error, lo relanzamos para distinguirlo del error de DB
    if (error instanceof Error && error.message.includes("datos válidos")) {
      throw error;
    }
    throw new DatabaseConnectionError(
      `Error en la base de datos al actualizar el usuario ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function checkIfUserIsActive
 * @description Verifica el estado `activo` (booleano) de un usuario por su ID.
 * @param {number} userId - ID del usuario a verificar.
 * @returns {Promise<object | null>} Promesa que resuelve con el objeto { activo: 0 | 1 } o null si el usuario no existe.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta.
 */
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

/**
 * @async
 * @function updateLastLogin
 * @description Actualiza la columna `ultimo_login` del usuario a la hora actual (`NOW()`).
 * @param {number} userId - ID del usuario.
 * @returns {Promise<boolean>} Promesa que resuelve a `true` si la actualización fue exitosa.
 * @throws {DatabaseConnectionError} Si la actualización falla (ej. usuario no encontrado).
 */
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
