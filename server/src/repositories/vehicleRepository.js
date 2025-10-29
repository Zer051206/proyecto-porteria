/**
 * @file vehicleRepository.js
 * @module Repositories/Parking
 * @description Capa de acceso a datos para la entidad 'Vehicle' (vehiculos).
 * Encapsula todas las consultas a la base de datos para la tabla 'vehiculos' utilizando Sequelize.
 * @requires sequelize // Para Op, fn, col
 * @requires ../models // Para acceder a los modelos Sequelize
 * @requires ../config/logger // Para logging de errores
 */
import { col, fn } from "sequelize";
import db from "../models/index.js";
import logger from "../config/logger.js";

const Vehicle = db.Vehicle;

/**
 * @async
 * @function countActiveByType
 * @description Cuenta cuántos vehículos están actualmente dentro ('esta_dentro' = true) y activos,
 * agrupados por tipo de vehículo.
 * @returns {Promise<object>} Un objeto con los conteos por tipo, ej: { Carro: 5, Moto: 10, Bicicleta: 8, Otros: 2 }.
 * Los tipos sin vehículos dentro tendrán un valor de 0.
 * @throws {Error} Si ocurre un error durante la consulta.
 */
export const countActiveByType = async () => {
  try {
    const results = await Vehicle.findAll({
      attributes: ["tipo_vehiculo", [fn("COUNT", col("id_vehiculo")), "count"]],
      where: {
        esta_dentro: true,
        activo: true,
      },
      group: ["tipo_vehiculo"],
      raw: true,
    });

    const counts = {
      Carro: 0,
      Moto: 0,
      Bicicleta: 0,
      Otros: 0,
    };

    results.forEach((result) => {
      const { tipo_vehiculo, count } = result;
      if (counts.hasOwnProperty(tipo_vehiculo)) {
        counts[tipo_vehiculo] = count;
      }
    });

    return counts;
  } catch (error) {
    logger.error(
      { error: error.message },
      "Error al contar vehículos activos por tipo"
    );
    throw error;
  }
};

/**
 * @async
 * @function findAll
 * @description Busca y devuelve todos los registros de vehículos que coincidan con las opciones.
 * @param {object} [options={}] - Opciones de Sequelize (where, include, order, limit, etc.).
 * @returns {Promise<Array<Vehicle>>} Un array con todas las instancias de Vehicle encontradas.
 */
export const findAll = async (options = {}) => {
  return Vehicle.findAll(options);
};

/**
 * @async
 * @function findById
 * @description Busca un vehículo por su clave primaria (id_vehiculo).
 * @param {number} id - El ID del vehículo a buscar.
 * @param {object} [options={}] - Opciones de Sequelize (include, transaction, etc.).
 * @returns {Promise<Vehicle|null>} La instancia del Vehicle encontrada o null si no existe.
 */
export const findById = async (id, options = {}) => {
  return Vehicle.findByPk(id, options);
};

/**
 * @async
 * @function findByPlate
 * @description Busca un único vehículo activo por su número de placa (si se proporciona).
 * @param {string|null} placa - El número de placa a buscar.
 * @param {object} [options={}] - Opciones de Sequelize (transaction, attributes, etc.).
 * @returns {Promise<Vehicle|null>} La instancia del Vehicle encontrada o null.
 */
export const findByPlate = async (placa, options = {}) => {
  if (!placa) return null;
  return Vehicle.findOne({
    where: { placa: placa },
    ...options,
  });
};

/**
 * @async
 * @function findBySensorCode
 * @description Busca un único vehículo activo por su código de sensor (si se proporciona).
 * @param {string|null} codigo_sensor - El código de sensor a buscar.
 * @param {object} [options={}] - Opciones de Sequelize (transaction, attributes, etc.).
 * @returns {Promise<Vehicle|null>} La instancia del Vehicle encontrada o null.
 */
export const findBySensorCode = async (codigo_sensor, options = {}) => {
  if (!codigo_sensor) return null;
  return Vehicle.findOne({
    where: { codigo_sensor: codigo_sensor },
    ...options,
  });
};

/**
 * @async
 * @function create
 * @description Crea un nuevo registro de vehículo en la base de datos.
 * @param {object} data - Los datos del vehículo a crear.
 * @param {object} [options={}] - Opciones de Sequelize (ej. transaction).
 * @returns {Promise<Vehicle>} La instancia del Vehicle recién creado.
 */
export const create = async (data, options = {}) => {
  return Vehicle.create(data, options);
};

/**
 * @async
 * @function update
 * @description Actualiza un vehículo existente por su ID.
 * @param {number} id - El ID del vehículo a actualizar.
 * @param {object} data - Objeto con los campos y nuevos valores a actualizar.
 * @param {object} [options={}] - Opciones de Sequelize (ej. transaction).
 * @returns {Promise<Array<number>>} Un array indicando el número de filas afectadas (ej. [1]). No devuelve el objeto actualizado directamente.
 */
export const update = async (id, data, options = {}) => {
  const [rowsAffected] = await Vehicle.update(data, {
    where: { id_vehiculo: id },
    ...options,
  });

  if (rowsAffected > 0) {
    return Vehicle.findByPk(id);
  }
  return null;
};
