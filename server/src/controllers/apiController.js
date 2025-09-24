import * as apiService from "../services/apiService.js";
import {
  InvalidPackageIdError,
  invalidVisitIdError,
} from "../utils/customErrors.js";

/**
 * @file - // * This file contains the controller functions for API endpoints.
 * @author M.M
 */

export const getAreas = async (req, res, next) => {
  try {
    const areas = await apiService.getAreas();
    return res.status(200).json(areas);
  } catch (error) {
    next(error);
  }
};

export const getTiposIdentificacion = async (req, res, next) => {
  try {
    const tiposIdentificacion = await apiService.getTiposIdentificacion();
    return res.status(200).json(tiposIdentificacion);
  } catch (error) {
    next(error);
  }
};

export const getActiveVisits = async (req, res, next) => {
  try {
    const activeVisits = await apiService.getActiveVisits();
    return res.status(200).json(activeVisits);
  } catch (error) {
    next(error);
  }
};

export const getTiposPaquetes = async (req, res, next) => {
  try {
    const tiposPaquetes = await apiService.getTiposPaquetes();
    return res.status(200).json(tiposPaquetes);
  } catch (error) {
    next(error);
  }
};

export const getVisitsHistorial = async (req, res, next) => {
  try {
    const visitsHistorial = await apiService.getVisitsHistorial();
    return res.status(200).json(visitsHistorial);
  } catch (error) {
    next(error);
  }
};

export const getPackagesHistorial = async (req, res, next) => {
  try {
    const packagesHistorial = await apiService.getPackagesHistorial();
    return res.status(200).json(packagesHistorial);
  } catch (error) {
    next(error);
  }
};

export const getPackageData = async (req, res, next) => {
  try {
    const pkgId = parseInt(req.params.id, 10);

    if (isNaN(pkgId) || pkgId <= 0) {
      throw new InvalidPackageIdError();
    }

    const packageData = await apiService.getPackageData(pkgId);

    return res.status(200).json(packageData);
  } catch (error) {
    next(error);
  }
};

export const getVisitData = async (req, res, next) => {
  try {
    const visitId = parseInt(req.params.id, 10);

    if (isNaN(visitId) || visitId <= 0) {
      throw new invalidVisitIdError();
    }

    const visitData = await apiService.getVisitData(visitId);

    return res.status(200).json(visitData);
  } catch (error) {
    next(error);
  }
};
