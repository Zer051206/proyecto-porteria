/**
 * @file IdentificationType.js
 * @module Models/Catalogues
 * @description Define el modelo de Sequelize para la tabla 'tipos_identificacion'.
 * Representa los diferentes tipos de documentos de identidad (ej. Cédula, Pasaporte).
 * @requires sequelize
 */

import { DataTypes } from "sequelize";

/**
 * @function defineIdentificationTypeModel
 * @description Define y devuelve el modelo 'IdentificationType' de Sequelize.
 * @param {Sequelize} sequelize - La instancia de Sequelize.
 * @returns {Model} El modelo 'IdentificationType' definido.
 */
export default (sequelize) => {
  /**
   * @class IdentificationType
   * @classdesc Modelo de Sequelize para la tabla `tipos_identificacion`.
   * @property {number} id_tipo_identificacion - La clave primaria del tipo de identificación.
   * @property {string} descripcion - La descripción del tipo de identificación (ej. "Cédula de Ciudadanía").
   */
  const IdentificationType = sequelize.define(
    "IdentificationType",
    {
      id_tipo_identificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      descripcion: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "tipos_identificacion",
      timestamps: false,
    }
  );

  IdentificationType.associate = (models) => {
    // Un Tipo de Identificación puede estar asociado a muchas Visitas.
    IdentificationType.hasMany(models.Visit, {
      foreignKey: "id_tipo_identificacion",
    });
  };

  return IdentificationType;
};
