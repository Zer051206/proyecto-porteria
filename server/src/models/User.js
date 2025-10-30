/**
 * @file User.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'usuarios'.
 * Este modelo es central para la aplicación, representando a los usuarios del sistema (admins y porteros)
 * y estableciendo sus relaciones con todas las acciones que pueden realizar.
 * @requires sequelize
 */

import { DataTypes } from "sequelize";

/**
 * @function defineUserModel
 * @description Define y devuelve el modelo 'User' de Sequelize.
 * @param {Sequelize} sequelize - La instancia de Sequelize.
 * @returns {Model} El modelo 'User' definido.
 */
export default (sequelize) => {
  /**
   * @class User
   * @classdesc Modelo de Sequelize para la tabla `usuarios`.
   * @property {number} id_usuario - La clave primaria del usuario.
   * @property {string} nombre - El nombre del usuario.
   * @property {string} apellido - El apellido del usuario.
   * @property {string} correo - El correo electrónico único del usuario.
   * @property {string|null} contrasena_hash - El hash de la contraseña (nulo para usuarios OAuth).
   * @property {string|null} id_oauth - El ID único proporcionado por el proveedor de OAuth.
   * @property {'google'|'microsoft'|null} proveedor_oauth - El proveedor de autenticación externa.
   * @property {'admin'|'portero'} rol - El rol del usuario en la aplicación.
   * @property {Date|null} ultimo_login - La fecha y hora del último inicio de sesión.
   * @property {boolean} activo - Indica si la cuenta del usuario está activa.
   * @property {Date} fecha_creacion - La fecha de creación del registro.
   * @property {Date} fecha_actualizacion - La fecha de la última actualización del registro.
   */
  const User = sequelize.define(
    "User",
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: { type: DataTypes.STRING(80), allowNull: false },
      apellido: { type: DataTypes.STRING(80), allowNull: false },
      correo: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      contrasena_hash: { type: DataTypes.STRING(255), allowNull: true },
      id_oauth: { type: DataTypes.STRING(255), allowNull: true, unique: true },
      proveedor_oauth: {
        type: DataTypes.ENUM("google", "microsoft"),
        allowNull: true,
      },
      rol: { type: DataTypes.ENUM("admin", "portero"), allowNull: false },
      ultimo_login: { type: DataTypes.DATE, allowNull: true },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      tableName: "usuarios",
      timestamps: true,
      createdAt: "fecha_creacion",
      updatedAt: "fecha_actualizacion",
    }
  );

  /**
   * @function associate
   * @description Define las asociaciones del modelo User con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  User.associate = (models) => {
    /**
     * @description Asociación (hasMany): Un Usuario puede registrar la ENTRADA de muchas Visitas.
     * @param {Model} models.Visit - El modelo de Visita.
     * @property {string} as - Alias 'VisitsEntered' para acceder a estas visitas desde un usuario.
     * @property {string} foreignKey - La clave foránea 'id_usuario_entrada' en la tabla `visitas`.
     */
    User.hasMany(models.Visit, {
      as: "VisitsEntered",
      foreignKey: "id_usuario_entrada",
    });

    /**
     * @description Asociación (hasMany): Un Usuario puede registrar la SALIDA de muchas Visitas.
     * @param {Model} models.Visit - El modelo de Visita.
     * @property {string} as - Alias 'VisitsExited' para acceder a estas visitas desde un usuario.
     * @property {string} foreignKey - La clave foránea 'id_usuario_salida' en la tabla `visitas`.
     */
    User.hasMany(models.Visit, {
      as: "VisitsExited",
      foreignKey: "id_usuario_salida",
    });

    /**
     * @description Asociación (hasMany): Un Usuario puede registrar la ENTRADA de muchos Vehículos
     * (a través de ParkingLog).
     * @param {Model} models.ParkingLog - El modelo de historial de parqueadero.
     * @property {string} as - Alias 'entryUser' (debería ser 'ParkingEntries' para claridad, pero coincide con tu código).
     * @property {string} foreignKey - La clave foránea 'id_usuario_entrada' en la tabla `parqueadero_registros`.
     */
    User.hasMany(models.ParkingLog, {
      as: "ParkingEntries",
      foreignKey: "id_usuario_entrada",
    });

    /**
     * @description Asociación (hasMany): Un Usuario puede registrar la SALIDA de muchos Vehículos
     * (a través de ParkingLog).
     * @param {Model} models.ParkingLog - El modelo de historial de parqueadero.
     * @property {string} as - Alias 'exitUser' (debería ser 'ParkingExits' para claridad, pero coincide con tu código).
     * @property {string} foreignKey - La clave foránea 'id_usuario_salida' en la tabla `parqueadero_registros`.
     */
    User.hasMany(models.ParkingLog, {
      as: "ParkingExits",
      foreignKey: "id_usuario_salida",
    });

    /**
     * @description Asociación (hasMany): Un Usuario puede RECIBIR muchos Paquetes.
     * @param {Model} models.Package - El modelo de Paquete.
     * @property {string} as - Alias 'PackagesReceived' para acceder a estos paquetes desde un usuario.
     * @property {string} foreignKey - La clave foránea 'id_usuario_recibir' en la tabla `paquetes`.
     */
    User.hasMany(models.Package, {
      as: "PackagesReceived",
      foreignKey: "id_usuario_recibir",
    });

    /**
     * @description Asociación (hasMany): Un Usuario puede ENVIAR muchos Paquetes.
     * @param {Model} models.Package - El modelo de Paquete.
     * @property {string} as - Alias 'PackagesSent' para acceder a estos paquetes desde un usuario.
     * @property {string} foreignKey - La clave foránea 'id_usuario_enviar' en la tabla `paquetes`.
     */
    User.hasMany(models.Package, {
      as: "PackagesSent",
      foreignKey: "id_usuario_enviar",
    });

    /**
     * @description Asociación (hasMany): Un Usuario puede generar muchos Logs de auditoría.
     * @param {Model} models.Log - El modelo de Log.
     * @property {string} foreignKey - La clave foránea 'id_usuario' en la tabla `logs`.
     */
    User.hasMany(models.Log, { foreignKey: "id_usuario" });

    /**
     * @description Asociación (hasMany): Un Usuario puede tener muchos Refresh Tokens.
     * @param {Model} models.RefreshToken - El modelo de RefreshToken.
     * @property {string} foreignKey - La clave foránea 'id_usuario' en la tabla `refresh_tokens`.
     */
    User.hasMany(models.RefreshToken, { foreignKey: "id_usuario" });
  };

  return User;
};
