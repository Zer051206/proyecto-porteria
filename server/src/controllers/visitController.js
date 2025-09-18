import { visitEntrySchema } from "../schemas/visitSchema.js";
import * as visitService from "../services/visitService.js";

export const createVisit = async (req, res, next) => {
  const validateVisitData = visitEntrySchema.safeParse(req.body);

  if (!validateVisitData.success) {
    validateVisitData.error?.errors?.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    return res.status(400).json({
      success: false,
      error: validateVisitData.error?.errors
    });
  }

  const userId = req.user.userId;

  const userIp = req.ip;
  
  const visitData = {
    ...validateVisitData.data,
    id_usuario: userId,
    ip_usuario: userIp,
  }


  try {
    const newVisit = await visitService.createVisit(visitData);

    return res.status(201).json({ 
      message: 'Visita registrada con éxito.',
      visit: newVisit
    });
  } catch (error) {
    next(error);
  }
};

export const updateVisitExit = async (req, res, next) => {
  const visitId = parseInt(req.params.id, 10);

  const userId = req.user.userId;

  const userIp = req.ip;

  if (isNaN(visitId) || visitId <= 0) {
    throw new Error('INVALID_ID')
  }

  const visitData = {
    visitId,
    id_usuario: userId,
    ip_usuario: userIp
  }
  
  try {
    const updateVisit = await visitService.updateVisitExit(visitData);
    
    if (!updateVisit) {
      throw new Error('VISIT_NOT_FOUND');
    }

    return res.status(200).json({ 
      message: 'Salida de visita registrada con éxito.',
      visit: updateVisit 
    });
  } catch (error) {
    next(error)
  } 
}