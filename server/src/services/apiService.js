import * as apiModel from '../models/apiModel.js';
import * as userModel from '../models/userModel.js'

/**
 * @file - // * This file contains the business logic for API endpoints.
 * @author M.M
 */

export const getAreas = async () => {
  const areas = await apiModel.fetchAreas();

  if (!areas) {
    throw new Error('No se pudieron obtener las áreas.');
  }

  return areas;
};

export const getTiposIdentificacion = async () => {
  const tiposIdentificacion = await apiModel.fetchTiposIdentificacion();

  if (!tiposIdentificacion) {
    throw new Error('No se pudieron obtener los tipos de identificación.');
  }

  return tiposIdentificacion;
};

export const getActiveVisits = async () => {
  const activeVisits = await apiModel.fetchActiveVisits();

  if(!activeVisits) {
    throw new Error('No se pudieron obtener las visitas activas.');
  }

  return activeVisits;
};

export const getTiposPaquetes = async () => {
  const tiposPaquetes = await apiModel.fetchTiposPaquetes();

  if (!tiposPaquetes) {
    throw new Error('No se pudieron obtener los tipos de paquetes.');
  }

  return tiposPaquetes;
};

export const getVisitsHistorial = async () => {
  const visitsHistorial = await apiModel.fetchVisitsHistorial();

  if (!visitsHistorial) {
    throw new Error('No se pudo obtener el historial de visitas.');
  };

  return visitsHistorial;
};
