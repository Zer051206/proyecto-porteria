import * as apiService from '../services/apiService.js';

/**
 * @file - // * This file contains the controller functions for API endpoints.
 * @author M.M
 */

export const getAreas = async (req, res) => {
  try {
    const areas = await apiService.getAreas();
    return res.status(200).json(areas);
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  }
};

export const getTiposIdentificacion = async (req, res) => {
  try {
    const tiposIdentificacion = await apiService.getTiposIdentificacion();
    return res.status(200).json(tiposIdentificacion);
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  }
};

export const getActiveVisits = async (req, res) => {
  try {
    const activeVisits = await apiService.getActiveVisits();
    return res.status(200).json(activeVisits);
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  }
};

export const getTiposPaquetes = async (req, res) => {
  try {
    const tiposPaquetes = await apiService.getTiposPaquetes();
    return res.status(200).json(tiposPaquetes);
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  } 
};

export const getVisitsHistorial = async (req, res) => {
  try {
    const visitsHistorial = await apiService.getVisitsHistorial();
    return res.status(200).json(visitsHistorial);
  } catch (error) {
    throw new Error('Error en la consulta a la base dedatos: ' + error.message);
  }
}