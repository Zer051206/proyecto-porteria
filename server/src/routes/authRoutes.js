import { ZodError } from 'zod';
import pkg from 'jsonwebtoken';
const { JsonWebTokenError, TokenExpiredError } = pkg;
import { Router } from 'express';
import * as refreshTokenModel from '../models/refreshTokenModel.js';
import * as authController from '../controllers/authController.js';

/**
 * @file - // * This file contains the authentication routes.
 * @author M.M
 */

const handleErrors = (err, req, res, next) => {
  // 1. Loguear el error para propósitos de depuración en el servidor
  console.error('Error en el middleware de autenticación:', err);

  // 2. Manejar errores de Zod (validación de datos)
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación en los datos de la solicitud',
      errors: err.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
    });
  }

  // 3. Manejar errores específicos de JWT (tokens)
  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido. Acceso no autorizado.'
    });
  }
  
  if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: 'Token expirado. Por favor, vuelve a iniciar sesión.'
    });
  }

  // 4. Manejar errores personalizados de los servicios
  if (err.message.includes('El correo electrónico ya está registrado')) {
    return res.status(409).json({
      success: false,
      message: err.message
    });
  }

  // 5. Manejar otros errores no esperados
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.'
  });
};

const router = Router()

router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

router.post('/refresh', authController.refreshToken)

router.post('/logout', authController.logoutUser)

router.get('/me', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        authenticated: false,
        message: 'no autenticado'
      })
    }

    const tokenData = await refreshTokenModel.findValidRefreshToken(refreshToken);

    if (!tokenData) {
      return res.status(401).json({
        authenticated: false,
        message: 'sesión expirada'
      });
    }

    res.json({
      authenticated: true,
      user: {
        id: tokenData.id_usuario,
        correo: tokenData.correo,
        rol: tokenData.rol
      }
    });
  } catch (error) {
    res.status(500).json({
      authenticated:false,
      message: 'Error del servidor'
    });
  }
});

router.use(handleErrors);

export default router;