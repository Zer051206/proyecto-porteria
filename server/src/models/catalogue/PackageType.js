/**
 * @file PackageType.js
 * @module Models/Catalogues
 * @description Define el modelo de Sequelize para la tabla 'tipos_paquetes'.
 * Representa las diferentes categorías de paquetes que se pueden registrar (ej. "Sobre", "Caja Mediana").
 * @requires sequelize
 */

import { DataTypes } from "sequelize";

/**
 * @function definePackageTypeModel
 * @description Define y devuelve el modelo 'PackageType' de Sequelize.
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').ModelCtor<Model>} El modelo 'PackageType' definido.
 */
export default (sequelize) => {
  /**
   * @class PackageType
   * @classdesc Modelo de Sequelize para la tabla `tipos_paquetes`.
   * @property {number} id_tipo_paquete - La clave primaria del tipo de paquete.
   * @property {string} descripcion - La descripción del tipo de paquete.
   */
  const PackageType = sequelize.define(
    "PackageType",
    {
      id_tipo_paquete: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      descripcion: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
    },
    {
      tableName: "tipos_paquetes",
      timestamps: false,
    }
  );

  /**
   * @function associate
   * @description Define la asociación del modelo PackageType con el modelo Package.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  PackageType.associate = (models) => {
    // Un Tipo de Paquete puede estar asociado a muchos Paquetes.
    PackageType.hasMany(models.Package, {
      foreignKey: "id_tipo_paquete",
    });
  };

  return PackageType;
};
