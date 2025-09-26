/**
 * @file apiService.js
 * @module apiService
 * @description Capa de servicios que contiene la lógica de negocio para obtener datos
 * estáticos (catálogos) y datos de historial de la aplicación, interactuando con apiModel.
 * Se encarga de validar la existencia de los datos y lanzar errores personalizados.
 */
import * as apiModel from "../models/apiModel.js";
import { ApiFetchError, ApiNoActiveVisitError } from "../utils/customErrors.js";

/**
 * @async
 * @function getAreas
 * @description Obtiene el listado de todas las áreas desde el modelo.
 * @returns {Promise<Array<object>>} Promesa que resuelve con la lista de áreas.
 * @throws {ApiFetchError} Si no se puede obtener la lista de áreas (ej. la consulta retorna nulo).
 */
export const getAreas = async () => {
  try {
    const areas = await apiModel.fetchAreas();

    if (!areas) {
      throw new ApiFetchError("No se pudo obtener el listado de áreas.");
    }

    return areas;
  } catch (error) {
    throw error;
  }
};

/**
 * @async
 * @function getTiposIdentificacion
 * @description Obtiene el listado de tipos de identificación desde el modelo.
 * @returns {Promise<Array<object>>} Promesa que resuelve con la lista de tipos de identificación.
 * @throws {ApiFetchError} Si no se puede obtener la lista de tipos de identificación.
 */
export const getTiposIdentificacion = async () => {
  try {
    const tiposIdentificacion = await apiModel.fetchTiposIdentificacion();

    if (!tiposIdentificacion) {
      throw new ApiFetchError(
        "No se pudo obtener el listado de tipos de identificación."
      );
    }

    return tiposIdentificacion;
  } catch (error) {
    throw error;
  }
};

/**
 * @async
 * @function getActiveVisits
 * @description Obtiene un listado de todas las visitas que se encuentran activas (pendientes de salida).
 * @returns {Promise<Array<object>>} Promesa que resuelve con la lista de visitas activas.
 * @throws {ApiNoActiveVisitError} Si no hay visitas activas registradas.
 */
export const getActiveVisits = async () => {
  try {
    const activeVisits = await apiModel.fetchActiveVisits();

    if (!activeVisits) {
      // Usamos un error específico ya que la ausencia de visitas activas puede ser una condición esperada
      throw new ApiNoActiveVisitError("No se encontraron visitas activas.");
    }

    return activeVisits;
  } catch (error) {
    throw error;
  }
};

/**
 * @async
 * @function getTiposPaquetes
 * @description Obtiene el listado de tipos de paquetes desde el modelo.
 * @returns {Promise<Array<object>>} Promesa que resuelve con la lista de tipos de paquetes.
 * @throws {ApiFetchError} Si no se puede obtener el listado de tipos de paquetes.
 */
export const getTiposPaquetes = async () => {
  try {
    const tiposPaquetes = await apiModel.fetchTiposPaquetes();

    if (!tiposPaquetes) {
      throw new ApiFetchError(
        "No se pudo obtener el listado de tipos de paquetes."
      );
    }

    return tiposPaquetes;
  } catch (error) {
    throw error;
  }
};

/**
 * @async
 * @function getVisitsHistorial
 * @description Obtiene el historial completo de visitas, aplicando un filtro de búsqueda si se proporciona.
 * @param {string | undefined} searchTerm - El término de búsqueda opcional para filtrar el historial.
 * @returns {Promise<Array<object>>} Promesa que resuelve con el historial de visitas.
 * @throws {ApiFetchError} Si la consulta de historial retorna nulo.
 */
export const getVisitsHistorial = async (searchTerm) => {
  try {
    const visitsHistorial = await apiModel.fetchVisitsHistorial(searchTerm);

    if (!visitsHistorial) {
      throw new ApiFetchError("No se pudo obtener el historial de visitas.");
    }

    return visitsHistorial;
  } catch (error) {
    throw error;
  }
};

/**
 * @async
 * @function getPackagesHistorial
 * @description Obtiene el historial completo de paquetes, aplicando un filtro de búsqueda si se proporciona.
 * @param {string | undefined} searchTerm - El término de búsqueda opcional para filtrar el historial.
 * @returns {Promise<Array<object>>} Promesa que resuelve con el historial de paquetes.
 * @throws {ApiFetchError} Si la consulta de historial retorna nulo.
 */
export const getPackagesHistorial = async (searchTerm) => {
  try {
    const packagesHistorial = await apiModel.fetchPackagesHistorial(searchTerm);

    if (!packagesHistorial) {
      throw new ApiFetchError("No se pudo obtener el historial de paquetes.");
    }

    return packagesHistorial;
  } catch (error) {
    throw error;
  }
};
