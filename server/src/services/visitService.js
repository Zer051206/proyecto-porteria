import * as visitModel from "../models/visitModel.js";
import {
  VisitExistsError,
  AreaDontExistsError,
  ActiveVisitDontExists,
  UpdateVisitError,
} from "../utils/customErrors.js";

/**
 * @file - // * This file contains the business logic for managing visits.
 * @author M.M
 */

export const createVisit = async (visitData) => {
  const { identificacion, id_area } = visitData;

  const activeVisite = await visitModel.findActiveVisitById(identificacion);

  if (activeVisite) {
    throw new VisitExistsError();
  }

  const areaExists = await visitModel.findAreaById(id_area);

  if (!areaExists) {
    throw new AreaDontExistsError();
  }

  const result = await visitModel.createVisit(visitData);

  return { id_visita: result.insertId.toString, ...visitData };
};

export const updateVisitExit = async (visitData) => {
  const { visitId } = visitData;

  const activeVisit = await visitModel.findActiveVisitById(visitId);

  if (!activeVisit) {
    throw new ActiveVisitDontExists();
  }

  const updatedVisit = await visitModel.updateVisitExit(visitData);

  if (!updatedVisit) {
    throw new UpdateVisitError();
  }

  return updatedVisit;
};
