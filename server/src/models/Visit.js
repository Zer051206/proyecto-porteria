/**
 * @file Visit.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'visitas'.
 * Este modelo representa el registro de una visita, desde la entrada hasta la salida,
 * y establece sus relaciones con los usuarios, áreas y tipos de identificación.
 * @requires sequelize
 */

import { DataTypes } from "sequelize";

/**
 * @function defineVisitModel
 * @description Define y devuelve el modelo 'Visit' de Sequelize.
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').ModelCtor<Model>} El modelo 'Visit' definido.
 */
export default (sequelize) => {
  /**
   * @class Visit
   * @classdesc Modelo de Sequelize para la tabla `visitas`.
   * @property {number} id_visita - La clave primaria de la visita.
   * @property {string} nombre_visitante - El nombre completo del visitante.
   * @property {string} telefono - El número de teléfono del visitante.
   * @property {string} identificacion - El número de identificación del visitante.
   * @property {number} id_tipo_identificacion - FK al tipo de identificación.
   * @property {string|null} empresa - La empresa que representa el visitante, si aplica.
   * @property {string} nombre_destinatario - El nombre del empleado o persona a quien se visita.
   * @property {number} id_area - FK al área de destino de la visita.
   * @property {Date} fecha_entrada - La fecha y hora exactas de la entrada.
   * @property {Date|null} fecha_salida - La fecha y hora exactas de la salida.
   * @property {boolean} estado - El estado de la visita (true: activa, false: finalizada).
   * @property {string} motivo - El motivo de la visita.
   * @property {string|null} observaciones - Observaciones adicionales.
   * @property {number} id_usuario_entrada - FK al usuario (portero) que registró la entrada.
   * @property {number|null} id_usuario_salida - FK al usuario (portero) que registró la salida.
   * @property {string} path_firma - La ruta al archivo de imagen de la firma del visitante.
   */
  const Visit = sequelize.define(
    "Visit",
    {
      id_visita: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre_visitante: { type: DataTypes.STRING(100), allowNull: false },
      telefono: { type: DataTypes.STRING(20), allowNull: false },
      identificacion: { type: DataTypes.STRING(20), allowNull: false },
      id_tipo_identificacion: { type: DataTypes.INTEGER, allowNull: false },
      empresa: { type: DataTypes.STRING(100), allowNull: true },
      nombre_destinatario: { type: DataTypes.STRING(100), allowNull: false },
      id_area: { type: DataTypes.INTEGER, allowNull: false },
      fecha_entrada: { type: DataTypes.DATE, allowNull: false },
      fecha_salida: { type: DataTypes.DATE, allowNull: true },
      estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      motivo: { type: DataTypes.TEXT, allowNull: false },
      observaciones: { type: DataTypes.TEXT, allowNull: true },
      id_usuario_entrada: { type: DataTypes.INTEGER },
      id_usuario_salida: { type: DataTypes.INTEGER, allowNull: true },
      path_firma: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: "visitas",
      timestamps: false,
    }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo Visit con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  Visit.associate = (models) => {
    // Asociación con el usuario que registra la ENTRADA
    Visit.belongsTo(models.User, {
      as: "EntryUser",
      foreignKey: "id_usuario_entrada",
    });

    // Asociación con el usuario que registra la SALIDA
    Visit.belongsTo(models.User, {
      as: "ExitUser",
      foreignKey: "id_usuario_salida",
    });

    // Asociación con el área de destino
    Visit.belongsTo(models.Area, { foreignKey: "id_area" });

    // Asociación con el tipo de identificación
    Visit.belongsTo(models.IdentificationType, {
      foreignKey: "id_tipo_identificacion",
    });
  };

  return Visit;
};
