/**
 * @file Log.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'logs'.
 * Este modelo representa un registro de auditoría y se relaciona directamente
 * con el usuario, la visita o el paquete involucrado en la acción.
 * @requires sequelize
 */

import { DataTypes } from "sequelize";

/**
 * @function defineLogModel
 * @description Define y devuelve el modelo 'Log' de Sequelize.
 * @param {Sequelize} sequelize - La instancia de Sequelize.
 * @returns {Model} El modelo 'Log' definido.
 */
export default (sequelize) => {
  /**
   * @class Log
   * @classdesc Modelo de Sequelize para la tabla `logs`.
   * @property {number} id_log - La clave primaria del registro de log.
   * @property {number|null} id_usuario - FK al usuario que realizó la acción.
   * @property {number|null} id_visita - FK a la visita relacionada con el log (si aplica).
   * @property {number|null} id_paquete - FK al paquete relacionado con el log (si aplica).
   * @property {string} accion - Una cadena que describe la acción realizada.
   * @property {Date} fecha_log - La fecha y hora en que se registró el log.
   * @property {string|null} descripcion - Un texto detallado que describe el evento.
   * @property {string} ip_usuario - La dirección IP del usuario que realizó la acción.
   */
  const Log = sequelize.define(
    "Log",
    {
      id_log: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // --- NUEVOS CAMPOS ---
      id_visita: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_paquete: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_vehiculo: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      accion: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ip_usuario: {
        type: DataTypes.STRING(39),
        allowNull: false,
      },
    },
    {
      tableName: "logs",
      timestamps: true,
      createdAt: "fecha_log",
      updatedAt: false,
    }
  );

  Log.associate = (models) => {
    Log.belongsTo(models.User, { foreignKey: "id_usuario" });
    Log.belongsTo(models.Visit, { foreignKey: "id_visita" });
    Log.belongsTo(models.Package, { foreignKey: "id_paquete" });
    Log.belongsTo(models.Vehicle, { foreignKey: "id_vehiculo" });
  };

  return Log;
};
