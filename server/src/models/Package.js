/**
 * @file Package.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'paquetes'.
 * Este modelo representa el registro de un paquete, ya sea de entrada (recibir) o de salida (enviar),
 * y establece sus relaciones con los usuarios, áreas y tipos de paquete.
 * @requires sequelize
 */

import { DataTypes } from "sequelize";

/**
 * @function definePackageModel
 * @description Define y devuelve el modelo 'Package' de Sequelize.
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').ModelCtor<Model>} El modelo 'Package' definido.
 */
export default (sequelize) => {
  /**
   * @class Package
   * @classdesc Modelo de Sequelize para la tabla `paquetes`.
   * @property {number} id_paquete - La clave primaria del registro del paquete.
   * @property {number} id_tipo_paquete - FK al tipo de paquete.
   * @property {'enviar'|'recibir'} tipo_operacion - El tipo de operación (entrada o salida).
   * @property {string|null} guia - El número de guía del paquete, si aplica.
   * @property {string|null} nombre_destinatario - El nombre del empleado a quien va dirigido (en 'recibir').
   * @property {number|null} id_area - FK al área de destino del paquete (en 'recibir').
   * @property {string|null} nombre_remitente - El nombre del empleado que envía el paquete (en 'enviar').
   * @property {string|null} destino_salida - La dirección de destino del paquete (en 'enviar').
   * @property {string|null} empresa_transporte - La empresa de mensajería (en 'enviar').
   * @property {string|null} mensajero_nombre - El nombre del mensajero que recoge el paquete (en 'enviar').
   * @property {Date|null} fecha_recibido - La fecha y hora de recepción.
   * @property {Date|null} fecha_envio - La fecha y hora de envío.
   * @property {string|null} observaciones - Observaciones adicionales.
   * @property {number|null} id_usuario_recibir - FK al usuario (portero) que registró la recepción.
   * @property {number|null} id_usuario_enviar - FK al usuario (portero) que registró el envío.
   */
  const Package = sequelize.define(
    "Package",
    {
      id_paquete: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_tipo_paquete: { type: DataTypes.INTEGER, allowNull: false },
      tipo_operacion: {
        type: DataTypes.ENUM("enviar", "recibir"),
        allowNull: false,
      },
      guia: { type: DataTypes.STRING(50), allowNull: true },
      nombre_destinatario: { type: DataTypes.STRING(100), allowNull: true },
      id_area: { type: DataTypes.INTEGER, allowNull: true },
      nombre_remitente: { type: DataTypes.STRING(100), allowNull: true },
      destino_salida: { type: DataTypes.STRING(100), allowNull: true },
      empresa_transporte: { type: DataTypes.STRING(100), allowNull: true },
      mensajero_nombre: { type: DataTypes.STRING(255), allowNull: true },
      fecha_recibido: { type: DataTypes.DATE, allowNull: true },
      fecha_envio: { type: DataTypes.DATE, allowNull: true },
      observaciones: { type: DataTypes.TEXT, allowNull: true },
      id_usuario_recibir: { type: DataTypes.INTEGER, allowNull: true },
      id_usuario_enviar: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "paquetes",
      timestamps: false, // Las fechas se gestionan manualmente
    }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo Package con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  Package.associate = (models) => {
    // Asociación con el tipo de paquete
    Package.belongsTo(models.PackageType, { foreignKey: "id_tipo_paquete" });

    // Asociación con el usuario que RECIBE
    Package.belongsTo(models.User, {
      as: "ReceivingUser",
      foreignKey: "id_usuario_recibir",
    });

    // Asociación con el usuario que ENVÍA
    Package.belongsTo(models.User, {
      as: "SendingUser",
      foreignKey: "id_usuario_enviar",
    });

    // Asociación con el área de destino (para paquetes recibidos)
    Package.belongsTo(models.Area, { foreignKey: "id_area" });
  };

  return Package;
};
