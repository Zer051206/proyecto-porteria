import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel.js'

const authMiddleware = async (req, res, next) => {
  let token = req.cookies.accessToken || req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ 
      message: 'Acceso no autorizado. Token no proporcionado.', 
      needsLogin: !refreshToken
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId

    const isActive = await userModel.checkIfUserIsActive(userId); 
    
    if (!isActive) {
      return res.status(403).json({ 
        message: 'Acceso denegado. la cuenta no está activada', 
        needsLogin: true
      });
    }

    req.user = { 
      userId: decoded.userId,
      correo: decoded.correo,
      rol: decoded.rol
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expirado.',
        expired: true,
        needsRefresh: !!refreshToken
      })
    }

    return res.status(401).json({
      message: 'Acceso denegado. Token inválido',
      needsLogin: true
    });
  }
};

export default authMiddleware;