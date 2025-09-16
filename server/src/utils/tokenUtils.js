import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export const generateAccessToken = (user) => {
  const payload = {
    userId: user.id_usuario,
    correo: user.correo,
    rol: user.rol
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Token de acceso inválido o expirado');
  }
};

export const getRefreshTokenExpiration = () => {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 7)
  return expiration; 
}