import { visitEntrySchema } from "../schemas/visitSchema.js";
import * as visitService from "../services/visitService.js";

export const createVisit = async (req, res) => {
  const validateVisitData = visitEntrySchema.safeParse(req.body);

  if (!validateVisitData.success) {
    const errors = validateVisitData.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    return res.status(400).json({ errors });
  }

  try {
    const newVisit = await visitService.createVisit(validateVisitData.data);
    return res.status(201).json({ 
      message: 'Visita registrada con éxito.',
      visit: newVisit 
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};