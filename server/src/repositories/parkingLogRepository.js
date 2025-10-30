/**
 * @file parkingLogRepository.js
 * @module Repositories/Parking
 * @description Capa de acceso a datos para la entidad 'ParkingLog' (parqueadero_registro).
 * Encapsula consultas a la BD para el historial de entradas/salidas.
 * @requires ../models/index.js
 */
import db from "../models/index.js";
const ParkingLog = db.ParkingLog;
const Vehicle = db.Vehicle;
const User = db.User;

/**
 * @async
 * @function findAll
 * @description Busca todos los registros de historial de parqueadero.
 * @param {object} [options={}] - Opciones de Sequelize (where, include, order, limit, etc.).
 * @returns {Promise<Array<ParkingLog>>} Array de registros encontrados.
 */
export const findAll = async (options = {}) => {
  return ParkingLog.findAll({
    include: [
      {
        model: Vehicle,
        as: "Vehicle",
        attributes: [
          "placa",
          "tipo_vehiculo",
          "nombre_dueno",
          "identificacion_dueno",
        ],
      },
      { model: User, as: "EntryUser", attributes: ["nombre", "rol"] },
      { model: User, as: "ExitUser", attributes: ["nombre", "rol"] },
    ],
    ...options,
  });
};

/**
 * @async
 * @function create
 * @description Crea un nuevo registro de historial de parqueadero (una entrada).
 * @param {object} data - Datos para el nuevo registro (debe incluir id_vehiculo, id_usuario_entrada).
 * @param {object} [options={}] - Opciones de Sequelize (ej. transaction).
 * @returns {Promise<ParkingLog>} La instancia del registro creado.
 */
export const create = async (data, options = {}) => {
  return ParkingLog.create(data, options);
};

/**
 * @async
 * @function updateExit
 * @description Actualiza el último registro de entrada abierto para un vehículo, marcando su salida.
 * Busca el registro con id_vehiculo específico y fecha_salida NULL y le asigna
 * la fecha_salida y el id_usuario_salida.
 * @param {object} data - Datos a actualizar (debe incluir fecha_salida, id_usuario_salida).
 * @param {number} id_vehiculo - El ID del vehículo cuya salida se registra.
 * @param {object} [options={}] - Opciones de Sequelize (ej. transaction).
 * @returns {Promise<Array<number>>} Un array con el número de filas afectadas (debería ser [1]).
 */
export const updateExit = async (data, id, options = {}) => {
  return ParkingLog.update(data, {
    where: { id_vehiculo: id, fecha_salida: null },
    order: [["fecha_entrada", "DESC"]],
    limit: 1,
    ...options,
  });
};
