import { visitEntrySchema } from "../schemas/visitSchema.js";
import * as visitService from "../services/visitService.js";
import {
  UpdateVisitError,
  VisitIdInvalidError,
} from "../utils/customErrors.js";

export const createVisit = async (req, res, next) => {
  const validateVisitData = visitEntrySchema.safeParse(req.body);

  if (!validateData.success) {
    const error = new Error("Error de validación de datos.");
    error.errors = validateData.error.errors;
    error.status = 400; // Código 400 para errores de validación
    return next(error);
  }

  const userId = req.user.userId;

  const userIp = req.ip;

  const visitData = {
    ...validateVisitData.data,
    id_usuario: userId,
    ip_usuario: userIp,
  };

  try {
    const newVisit = await visitService.createVisit(visitData);

    return res.status(201).json({
      message: "Visita registrada con éxito.",
      visit: newVisit,
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
    throw new VisitIdInvalidError();
  }

  const visitData = {
    visitId,
    id_usuario: userId,
    ip_usuario: userIp,
  };

  try {
    const updateVisit = await visitService.updateVisitExit(visitData);

    return res.status(200).json({
      message: "Salida de visita registrada con éxito.",
      visit: updateVisit,
    });
  } catch (error) {
    next(error);
  }
};
