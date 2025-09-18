import * as visitController from '../controllers/visitController.js';
import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { success } from 'zod';

/**
 * @file - // * This file contains the visit management routes.
 * @author M.M
*/

const handleErrors = (err, req, res, next) => {
  console.log(err);

  if (err.name == 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validacion',
      errors: err.errors
    });
  }
  if (err.message.includes('NO_VISIT_ACTIVE_BY_ID')) {
    return res.status(404).json({
      success: false,
      message: 'No hay ninguna visita activa con el identificador proporcionado.'
    });
  }

  if (err.message.includes('VISIT_EXIST')) {
    return res.status(409).json({
      success: false,
      message: 'Una visita con el mismo identificador está activa.'
    })
  }

  if (err.message.includes('UPDATE_VISIT_ERROR')) {
    return res.status(500).json({
      succes: false,
      message: 'Ocurrió un error inesperado al actualizar la visita.'
    })
  }

  if (err.message.includes('VISIT_NOT_FOUND')) {
    return res.status(404).json({
      success: false,
      message: 'La visita no fue encontrada'
    })
  }

  if (err.message.includes('INVALID_ID')) {
    return res.status(400).json({
      success: false,
      message: 'El identificador proporcionado de la visita es inválido'
    })
  }

  if (err.message.includes('AREA_DONT_EXISTS')) {
    return res.status(400).json({
      success: false,
      message: 'El área proporcionada no existe'
    })
  }

  return res.status(500).json({
    success: false,
    message: 'Error interno en la aplicación'
  });
};

const router = Router();

router.post('/entrada', authMiddleware, visitController.createVisit);

router.patch('/salida/:id', authMiddleware, visitController.updateVisitExit);

router.use(handleErrors);

export default router;