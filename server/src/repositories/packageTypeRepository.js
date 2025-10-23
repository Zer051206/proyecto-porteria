/**
 * @file PackageTypeRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'PackageType'.
 * Encapsula todas las consultas a la base de datos para la tabla 'tipos_identificacion' utilizando Sequelize.
 * @requires ../models/index.js
 */

import db from "../models/index.js";
const PackageType = db.PackageType;

/**
 * @async
 * @function findAll
 * @description Busca y devuelve todos los tipos de identificación, ordenados por su descripción.
 * @returns {Promise<Array<PackageType>>} Un array de todos los objetos de tipo de identificación.
 */
export const findAll = async () => {
  return PackageType.findAll({
    order: [["descripcion", "ASC"]],
  });
};
