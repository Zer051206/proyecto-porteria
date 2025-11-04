/**
 * @file packageRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'Package'.
 * Encapsula todas las consultas a la base de datos para la tabla 'paquetes' utilizando Sequelize.
 * @requires ../models/index.js
 */

import db from "../models/index.js";
const Package = db.Package;
const User = db.User;
const Area = db.Area;
const PackageType = db.PackageType;

/**
 * @async
 * @function findAll
 * @description Busca y devuelve todos los paquetes con sus relaciones principales.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para filtros).
 * @returns {Promise<Array<Package>>} Un array de todos los objetos de paquete.
 */
export const findAll = async (options = {}) => {
  return Package.findAll({
    include: [
      {
        model: User,
        as: "PackagesReceived",
        attributes: ["nombre", "apellido"],
      },
      { model: User, as: "PackagesSent", attributes: ["nombre", "apellido"] },
      { model: Area, attributes: ["nombre_area"] },
      { model: PackageType, attributes: ["descripcion"] },
    ],
    ...options,
  });
};

/**
 * @async
 * @function findById
 * @description Busca un paquete específico por su ID con sus relaciones.
 * @param {number} id - El ID del paquete a buscar.
 * @returns {Promise<Package|null>} El objeto del paquete si se encuentra, o null.
 */
export const findById = async (id) => {
  return Package.findByPk(id, {
    include: [
      {
        model: User,
        as: "PackagesReceived",
        attributes: ["nombre", "apellido"],
      },
      { model: User, as: "Packagessent", attributes: ["nombre", "apellido"] },
      { model: Area, attributes: ["nombre_area"] },
      { model: PackageType, attributes: ["descripcion"] },
    ],
  });
};

/**
 * @async
 * @function findByGuide
 * @description Busca un paquete por su número de guía y tipo de operación.
 * @param {string} guia - El número de guía a buscar.
 * @param {'enviar'|'recibir'} tipo_operacion - El tipo de operación del paquete.
 * @returns {Promise<Package|null>} El objeto del paquete si se encuentra, o null.
 */
export const findByGuide = async (guia, tipo_operacion) => {
  if (!guia) return null; // No buscar si la guía es nula o indefinida
  return Package.findOne({
    where: {
      guia: guia,
      tipo_operacion: tipo_operacion,
    },
  });
};

/**
 * @async
 * @function create
 * @description Crea un nuevo registro de paquete en la base de datos.
 * @param {object} packageData - Los datos del paquete a crear.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<Package>} El objeto del paquete recién creado.
 */
export const create = async (packageData, options = {}) => {
  return Package.create(packageData, options);
};

/**
 * @async
 * @function findFiles
 * @description Busca y devuelve todos los registros de paquetes marcados como radicados.
 * Es un alias de findAll, ya que el servicio proporciona el filtro 'where'.
 * @param {object} [options={}] - Opciones de Sequelize (ej. where: { es_radicado: true }).
 * @returns {Promise<Array<Package>>} Un array de los paquetes (radicados) encontrados.
 */
export const findFiles = async (options = {}) => {
  return findAll(options);
};
