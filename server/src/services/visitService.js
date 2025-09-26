/**
 * @file visitService.js
 * @module visitService
 * @description Capa de servicio para la gestión del flujo de visitas: registro de entrada
 * y registro de salida. Contiene la lógica de negocio para la validación de duplicados
 * y la verificación de IDs de referencia (áreas).
 */
import * as visitModel from "../models/visitModel.js";
import {
  VisitExistsError,
  AreaDontExistsError,
  ActiveVisitDontExists,
  UpdateVisitError,
} from "../utils/customErrors.js";

/**
 * @async
 * @function createVisit
 * @description Registra la entrada de un nuevo visitante. Verifica dos condiciones clave:
 * 1. Que no exista una visita activa previa para la misma identificación.
 * 2. Que el ID de área proporcionado sea válido.
 * @param {object} visitData - Objeto con los datos de la visita a registrar, incluyendo identificacion e id_area.
 * @returns {Promise<object>} Promesa que resuelve con el ID de la visita recién creada y los datos proporcionados.
 * @throws {VisitExistsError} Si ya existe una visita activa para esa identificación.
 * @throws {AreaDontExistsError} Si el ID de área no corresponde a un área válida.
 */
export const createVisit = async (visitData) => {
  try {
    const { identificacion, id_area } = visitData;

    // 1. Verificar visitas activas previas
    const activeVisite = await visitModel.findActiveVisitByIdentificacion(
      identificacion
    );

    if (activeVisite) {
      throw new VisitExistsError();
    }

    // 2. Verificar que el área exista
    const areaExists = await visitModel.findAreaById(id_area);

    if (!areaExists) {
      throw new AreaDontExistsError();
    }

    // 3. Crear la visita
    const result = await visitModel.createVisit(visitData);

    return { id_visita: result.insertId, ...visitData };
  } catch (error) {
    throw error;
  }
};

/**
 * @async
 * @function updateVisitExit
 * @description Registra la salida de una visita activa. Verifica que la visita exista
 * y que actualmente se encuentre activa (sin hora de salida registrada).
 * @param {object} visitData - Objeto que contiene el ID de la visita (`visitId`) y metadatos de auditoría.
 * @returns {Promise<object>} Promesa que resuelve con el objeto de la visita actualizada.
 * @throws {ActiveVisitDontExists} Si la visita no existe o ya ha sido marcada como salida.
 * @throws {UpdateVisitError} Si la actualización en el modelo no es exitosa (ej. 0 filas afectadas).
 */
export const updateVisitExit = async (visitData) => {
  try {
    const { visitId } = visitData;

    // 1. Verificar si la visita existe y está activa
    const activeVisit = await visitModel.findActiveVisitByVisitId(visitId);

    if (!activeVisit) {
      throw new ActiveVisitDontExists();
    }

    // 2. Registrar la salida
    const updatedVisit = await visitModel.updateVisitExit(visitData);

    if (!updatedVisit) {
      throw new UpdateVisitError();
    }

    return updatedVisit;
  } catch (error) {
    throw error;
  }
};
