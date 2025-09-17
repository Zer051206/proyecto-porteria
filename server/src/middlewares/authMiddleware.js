import { verifyAccessToken, generateAccessToken } from '../utils/tokenUtils.js';
import * as userModel from '../models/userModel.js';
import * as refreshTokenModel from '../models/refreshTokenModel.js';

const authMiddleware = async (req, res, next) => {
  try {
    let accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // Si no hay access token, intentar con refresh token
    if (!accessToken && refreshToken) {
      
      try {
        // Buscar refresh token válido
        const tokenData = await refreshTokenModel.findValidRefreshToken(refreshToken);
        
        if (tokenData) {
          // Generar nuevo access token
          const newAccessToken = generateAccessToken({
            id_usuario: tokenData.id_usuario,
            correo: tokenData.correo,
            rol: tokenData.rol
          });

          // Establecer nueva cookie
          res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000, // ^ 15 minutos
            path: '/'
          });

          accessToken = newAccessToken;
        }
      } catch (refreshError) {
        console.error('Error al renovar token:', refreshError.message);
      }
    }

    // Si aún no hay access token
    if (!accessToken) {
      return res.status(401).json({ 
        message: 'Acceso no autorizado. Token no proporcionado.',
        needsLogin: true
      });
    }

    // Verificar access token
    let decoded;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch (tokenError) {
      console.log('Access token inválido:', tokenError.message);
      
      // Si el token es inválido y tenemos refresh token, intentar renovar
      if (refreshToken) {
        try {
          const tokenData = await refreshTokenModel.findValidRefreshToken(refreshToken);
          
          if (tokenData) {
            const newAccessToken = generateAccessToken({
              id_usuario: tokenData.id_usuario,
              correo: tokenData.correo,
              rol: tokenData.rol
            });

            res.cookie('accessToken', newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 15 * 60 * 1000,
              path: '/'
            });

            decoded = verifyAccessToken(newAccessToken);
          } else {
            throw new Error('Refresh token inválido');
          }
        } catch (refreshError) {
          return res.status(401).json({ 
            message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
            needsLogin: true
          });
        }
      } else {
        return res.status(401).json({ 
          message: 'Token inválido. Por favor, inicia sesión nuevamente.',
          needsLogin: true
        });
      }
    }

    // Verificar que el usuario siga activo
    const isActive = await userModel.checkIfUserIsActive(decoded.userId);
    if (!isActive) {
      return res.status(403).json({ 
        message: 'Acceso denegado. La cuenta no está activada',
        needsLogin: true
      });
    }

    // Usuario autenticado correctamente
    req.user = { 
      userId: decoded.userId,
      email: decoded.email,
      rol: decoded.rol
    };
    next();
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      needsLogin: true
    });
  }
};

export default authMiddleware;