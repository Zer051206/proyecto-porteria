import { getPool } from '../config/db.config.js';

export const saveRefreshToken = async (userId, refreshToken, expiredAt) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      INSERT INTO refresh_tokens (id_usuario, token, expira_en) 
      VALUES (?, ?, ?)
    `; 

    const result = await connect.query(query, [userId, refreshToken, expiredAt]);
    return result;
  } catch (error) {
    throw new Error('Error al guardar el refresh token: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
};

export const findValidRefreshToken = async (refreshToken) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      SELECT u.id_usuario, u.correo, u.rol, u.activo
      FROM refresh_tokens rt 
      JOIN usuarios u ON rt.id_usuario = u.id_usuario
      WHERE rt.token = ?
      AND rt.expira_en > NOW()
      AND rt.revocado = FALSE
      AND u.activo = 1
    `;
    const rows = await connect.query(query, [refreshToken]);
    
    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Error al buscar el refresh token: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
};

export const revokeRefreshToken = async (refreshToken) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      UPDATE refresh_tokens SET revocado = 1
      WHERE token = ? 
    `;
    const result = await connect.query(query, [refreshToken]);
    return result;
  } catch (error) {
    throw new Error('Error al revocer el refresh token: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
};

export const revokeAllUserTokens = async (userId) => {
  let connect; 
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      UPDATE refresh_tokens SET revocado = 1
      WHERE id_usuario = ?
    `
    const result = await connect.query(query, [userId]);
    return result
  } catch (error) {
    throw new Error('Error al revocar los refresh tokens del usuario: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
};

export const cleanExpiresTokens = async () => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      DELETE from refresh_tokens 
      WHERE exprira_en < NOW() OR revocado = 1
    `;
    const result = connect.query(query);
    return result;
  } catch (error) {
    throw new Error('Error al limpiar los tokens expirados: ' + error.message);
  } finally {
    if (connect) connect.release();
  }
} 