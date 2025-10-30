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
 * @param {Sequelize} sequelize - La instancia de Sequelize.
 * @returns {Model} El modelo 'Package' definido.
 */
export default (sequelize) => {
  /**
   * @class Package
   * @classdesc Modelo de Sequelize para la tabla `paquetes`.
   * @property {number} id_paquete - PK
   * @property {number} id_tipo_paquete - FK (TiposPaquetes)
   * @property {string} tipo_operacion - 'enviar' o 'recibir'
   * @property {string|null} guia - Número de guía/tracking.
   * @property {string|null} nombre_destinatario - Nombre del destinatario (interno).
   * @property {number|null} id_area - FK (Areas)
   * @property {string|null} nombre_remitente - Nombre del remitente (interno).
   * @property {string|null} destino_salida - Dirección de destino (envío).
   * @property {string|null} empresa_transporte - Empresa de mensajería.
   * @property {string|null} mensajero_nombre - Nombre del mensajero.
   * @property {Date|null} fecha_recibido - Timestamp de recepción.
   * @property {Date|null} fecha_envio - Timestamp de envío.
   * @property {string|null} observaciones - Observaciones generales.
   * @property {number|null} id_usuario_recibir - FK (Usuarios) Portero que recibió.
   * @property {number|null} id_usuario_enviar - FK (Usuarios) Portero que envió.
   * @property {boolean} es_radicado - TRUE si es un radicado.
   * @property {string|null} referencia_radicado - N° único del radicado (UNIQUE).
   * @property {string|null} nombre_recibe_documento - Empleado que recibe el documento/radicado.
   * @property {string|null} path_firma_recibe_documento - Firma del empleado que recibe.
   * @property {string|null} path_firma_validador - Firma del portero (validador) al recibir radicado.
   * @property {string|null} path_firma_entregador - Firma del mensajero (entregador) al recibir radicado.
   * @property {string|null} path_firma_validador_envio - Firma del portero (validador) al enviar.
   * @property {string|null} path_firma_remitente - Firma del empleado (remitente) al enviar.
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
      es_radicado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      referencia_radicado: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      nombre_recibe_documento: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      path_firma_recibe_documento: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      path_firma_validador: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      path_firma_entregador: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      path_firma_validador_envio: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      path_firma_remitente: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
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
    /**
     * @description Asociación (belongsTo): Un Paquete pertenece a un Tipo de Paquete.
     * @param {Model} models.TiposPaquete - El modelo TiposPaquete.
     * @property {string} as - Alias 'PackageType'.
     */
    Package.belongsTo(models.PackageType, { foreignKey: "id_tipo_paquete" });

    /**
     * @description Asociación (belongsTo): Un Paquete puede pertenecer a un Área.
     * @param {Model} models.Area - El modelo Area.
     * @property {string} as - Alias 'Area'.
     */
    Package.belongsTo(models.User, {
      as: "PackagesReceived",
      foreignKey: "id_usuario_recibir",
    });

    /**
     * @description Asociación (belongsTo): Un Paquete es recibido por un Usuario (Portero).
     * @param {Model} models.User - El modelo User.
     * @property {string} as - Alias 'ReceivedBy'.
     */
    Package.belongsTo(models.User, {
      as: "PackagesSent",
      foreignKey: "id_usuario_enviar",
    });

    /**
     * @description Asociación (belongsTo): Un Paquete es enviado por un Usuario (Portero).
     * @param {Model} models.User - El modelo User.
     * @property {string} as - Alias 'SentBy'.
     */
    Package.belongsTo(models.Area, { foreignKey: "id_area" });
  };

  return Package;
};
