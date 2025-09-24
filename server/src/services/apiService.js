import * as apiModel from "../models/apiModel.js";
import { ApiFetchError, ApiNoActiveVisitError } from "../utils/customErrors.js";

/**
 * @file - // This file contains the business logic for API endpoints.
 * @author M.M
 */

export const getAreas = async () => {
  try {
    const areas = await apiModel.fetchAreas();

    if (!areas) {
      throw new ApiFetchError();
    }

    return areas;
  } catch (error) {
    throw error;
  }
};

export const getTiposIdentificacion = async () => {
  try {
    const tiposIdentificacion = await apiModel.fetchTiposIdentificacion();

    if (!tiposIdentificacion) {
      throw new ApiFetchError();
    }

    return tiposIdentificacion;
  } catch (error) {
    throw error;
  }
};

export const getActiveVisits = async () => {
  try {
    const activeVisits = await apiModel.fetchActiveVisits();

    if (!activeVisits) {
      throw new ApiNoActiveVisitError();
    }

    return activeVisits;
  } catch (error) {
    throw error;
  }
};

export const getTiposPaquetes = async () => {
  try {
    const tiposPaquetes = await apiModel.fetchTiposPaquetes();

    if (!tiposPaquetes) {
      throw new ApiFetchError();
    }

    return tiposPaquetes;
  } catch (error) {
    throw error;
  }
};

export const getVisitsHistorial = async () => {
  try {
    const visitsHistorial = await apiModel.fetchVisitsHistorial();

    if (!visitsHistorial) {
      throw new ApiFetchError();
    }

    return visitsHistorial;
  } catch (error) {
    throw error;
  }
};

export const getPackagesHistorial = async () => {
  try {
    const packagesHistorial = await apiModel.fetchPackagesHistorial();

    if (!packagesHistorial) {
      throw new ApiFetchError();
    }

    return packagesHistorial;
  } catch (error) {
    throw error;
  }
};

export const getPackageData = async (pkgId) => {
  try {
    const packageData = await apiModel.fetchPackageData(pkgId);

    if (!packageData) {
      throw new ApiFetchError();
    }

    return packageData;
  } catch (error) {
    throw error;
  }
};

export const getVisitData = async (visitId) => {
  try {
    const visitData = await apiModel.fetchVisitData(visitId);

    if (!visitData) {
      throw new ApiFetchError();
    }

    return visitData;
  } catch (error) {
    throw error;
  }
};
