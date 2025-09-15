import * as apiService from '../services/apiService.js';

/**
 * @file - // * This file contains the controller functions for API endpoints.
 * @author M.M
 */



export const getAreas = async (req, res, next) => {
  try {
    const areas = await apiService.getAreas();
    return res.status(200).json(areas);
  } catch (error) {
    next(error)
  }
};

export const getTiposIdentificacion = async (req, res, next) => {
  try {
    const tiposIdentificacion = await apiService.getTiposIdentificacion();
    return res.status(200).json(tiposIdentificacion);
  } catch (error) {
    next(error)
  }
};

export const getActiveVisits = async (req, res, next) => {
  try {
    const activeVisits = await apiService.getActiveVisits();
    return res.status(200).json(activeVisits);
  } catch (error) {
    next(error)
  }
};

export const getTiposPaquetes = async (req, res, next) => {
  try {
    const tiposPaquetes = await apiService.getTiposPaquetes();
    return res.status(200).json(tiposPaquetes);
  } catch (error) {
    next(error)
  } 
};

export const getVisitsHistorial = async (req, res, next) => {
  try {
    const visitsHistorial = await apiService.getVisitsHistorial();
    return res.status(200).json(visitsHistorial);
  } catch (error) {
    next(error)
  }
}