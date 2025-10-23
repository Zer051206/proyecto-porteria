/**
 * @file Area.js
 * @module Models/Catalogues
 * @description Define el modelo de Sequelize para la tabla 'areas'.
 * Representa las diferentes áreas o departamentos de destino para visitas o paquetes.
 * @requires sequelize
 */

import { DataTypes } from "sequelize";

/**
 * @function defineAreaModel
 * @description Define y devuelve el modelo 'Area' de Sequelize.
 * @param {Sequelize} sequelize - La instancia de Sequelize.
 * @returns {Model} El modelo 'Area' definido.
 */
export default (sequelize) => {
  /**
   * @class Area
   * @classdesc Modelo de Sequelize para la tabla `areas`.
   * @property {number} id_area - La clave primaria del área.
   * @property {string} nombre_area - El nombre único del área (ej. "Recursos Humanos").
   */
  const Area = sequelize.define(
    "Area",
    {
      id_area: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre_area: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "areas",
      timestamps: false,
    }
  );

  Area.associate = (models) => {
    // Un Área puede tener muchas Visitas y muchos Paquetes.
    Area.hasMany(models.Visit, { foreignKey: "id_area" });
    Area.hasMany(models.Package, { foreignKey: "id_area" });
  };

  return Area;
};
