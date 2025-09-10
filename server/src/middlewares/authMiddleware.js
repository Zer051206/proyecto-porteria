import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel.js'

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId

    const isActive = await userModel.checkIfUserIsActive(userId); 
    
    if (!isActive) {
      return res.status(403).json({ message: 'Acceso denegado. la cuenta no está activada' })
    }

    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Acceso no autorizado. Token inválido.' });
  }
};

export default authMiddleware;