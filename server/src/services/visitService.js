import * as visitModel from '../models/visitModel.js';

/**
 * @file - // * This file contains the business logic for managing visits.
 * @author M.M
 */

export const createVisit = async (visitData) => {
  const {  identificacion, id_area } = visitData;

  const activeVisite = visitModel.findActiveVisitById(identificacion);
  if (activeVisite) {
    throw new Error('La visita ya existe');
  }

  const areaExists = await visitModel.findAreaById(id_area);
  if (!areaExists) {
      throw new Error('El área de destino no es válida.');
  }

  const newVisit = await Visita.createVisit(visitData);

  return newVisit;
}

export const updateVisitExit = async (id) => {
  
  const activeVisit = await visitModel.findActiveVisitById(visitId);
  
  if (!activeVisit) {
    return res.status(404).json({ message: 'No se encontró una visita activa con el ID proporcionado.' });
  }

  const updatedVisit = await visitModel.updateVisitExit(id);

  if (!updatedVisit) {
    throw new Error('No se pudo registrar la salida de la visita.');
  }

  return updatedVisit;
}