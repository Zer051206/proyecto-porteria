//src /routes/apiRoutes.js
import { Router } from "express";
import pkg from 'jsonwebtoken';
const { JsonWebTokenError, TokenExpiredError } = pkg;
import * as apiController from '../controllers/apiController.js';
import authMiddleware from "../middlewares/authMiddleware.js";

const handleErrors = (err, req, res, next) => {
  
  if (err.message.includes('No se pudieron obtener')){
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }

  if (err.message.includes('No hay')) {
    return res.status(204).json({
      success: false,
      message: err.message
    });
  }

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

  if (err.message.includes('El usuario está')) {
    return res.status(401).json({
      succes:false,
      message: 'El usuario no se encuentra activado.'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.'
  });
};

const router = Router();

router.get('/status', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Sesión activa' });
});

router.get('/areas', authMiddleware, apiController.getAreas);

router.get('/tipos-identificacion', authMiddleware, apiController.getTiposIdentificacion);

router.get('/visitas-activas', authMiddleware, apiController.getActiveVisits);

router.get('/tipos-paquetes', authMiddleware, apiController.getTiposPaquetes);

router.get('/visitas', authMiddleware, apiController.getVisitsHistorial)

router.get('/paquetes', authMiddleware, apiController.getPackagesHistorial)

router.use(handleErrors)

export default router;