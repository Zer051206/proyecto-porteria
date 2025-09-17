import { visitEntrySchema } from "../schemas/visitSchema.js";
import * as visitService from "../services/visitService.js";

export const createVisit = async (req, res) => {
  const validateVisitData = visitEntrySchema.safeParse(req.body);

  if (validateVisitData.success === false) {
    const errors = validateVisitData.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    return res.status(400).json({ errors });
  }

  const userId = req.user.userId;

  const userIp = req.ip

  const visitData = {
    ...validateVisitData.data,
    id_usuario: userId,
    ip_usuario: userIp
  }


  try {
    const newVisit = await visitService.createVisit(visitData);
    return res.status(201).json({ 
      message: 'Visita registrada con éxito.',
      visit: newVisit 
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const updateVisitExit = async (req, res) => {
  const visitId = parseInt(req.params.id, 10);

  const userId = req.user.userId;

  const userIp = req.ip;

  const visitData = {
    visitId,
    id_usuario: userId,
    ip_usuario: userIp
  }

  if (isNaN(visitId) || visitId <= 0) {
      return res.status(400).json({ message: 'ID de visita inválido.' });
    }
  
  try {
    const updateVisit = await visitService.updateVisitExit(visitData);
    if (!updateVisit) {
      return res.status(404).json({ message: 'Visita no encontrada o ya registrada la salida.' });
    }
    return res.status(200).json({ 
      message: 'Salida de visita registrada con éxito.',
      visit: updateVisit 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor.' });
  } 
}