//src/services/visitService.js
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
  try {
    const { identificacion, id_area } = visitData;

    const activeVisite = await visitModel.findActiveVisitByIdentificacion(
      identificacion
    );

    if (activeVisite) {
      throw new VisitExistsError();
    }

    const areaExists = await visitModel.findAreaById(id_area);

    if (!areaExists) {
      throw new AreaDontExistsError();
    }

    const result = await visitModel.createVisit(visitData);

    return { id_visita: result.insertId.toString(), ...visitData };
  } catch (error) {
    throw error;
  }
};

export const updateVisitExit = async (visitData) => {
  try {
    const { visitId } = visitData;

    const activeVisit = await visitModel.findActiveVisitByVisitId(visitId);

    if (!activeVisit) {
      throw new ActiveVisitDontExists();
    }

    const updatedVisit = await visitModel.updateVisitExit(visitData);

    if (!updatedVisit) {
      throw new UpdateVisitError();
    }

    return updatedVisit;
  } catch (error) {
    throw error;
  }
};
