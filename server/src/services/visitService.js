import * as visitModel from '../models/visitModel.js';

/**
 * @file - // * This file contains the business logic for managing visits.
 * @author M.M
 */

export const createVisit = async (visitData) => {
  const {  identificacion, id_area } = visitData;

  const activeVisite = await visitModel.findActiveVisitById(identificacion);

  if (activeVisite) {
    throw new Error('VISIT_EXIST');
  }

  const areaExists = await visitModel.findAreaById(id_area);
  
  if (!areaExists) {
    throw new Error('AREA_DONT_EXISTS');
  }

  const result = await visitModel.createVisit(visitData);

  return { id_visita: result.insertId.toString, ...visitData  };
}

export const updateVisitExit = async (visitData) => {

  const { visitId } = visitData;
  
  const activeVisit = await visitModel.findActiveVisitById(visitId);
  
  if (!activeVisit) {
    throw new Error('NO_VISIT_ACTIVE_BY_ID');
  }

  const updatedVisit = await visitModel.updateVisitExit(visitData);

  if (!updatedVisit) {
    throw new Error('UPDATE_VISIT_ERROR');
  }

  return updatedVisit;
}