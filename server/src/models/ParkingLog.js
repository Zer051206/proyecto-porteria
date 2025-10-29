/**
 * @file ParkingLog.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'parqueadero_registro'.
 * Este modelo registra el historial de entradas y salidas de vehículos en el parqueadero.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineParkingLogModel
 * @description Define y devuelve el modelo 'ParkingLog' de Sequelize para el historial del parqueadero, usando sequelize.define.
 * @param {Sequelize} sequelize - La instancia de Sequelize.
 * @returns {Model} El constructor del modelo 'ParkingLog' definido.
 */
export default (sequelize) => {
  /**
   * @class ParkingLog
   * @classdesc Modelo de Sequelize para la tabla `parqueadero_registros`. Representa una única entrada o salida del parqueadero.
   * @property {number} id_registro - Clave primaria autoincremental del registro.
   * @property {number} id_vehiculo - Clave foránea que referencia al vehículo asociado (tabla `vehiculos`).
   * @property {Date} fecha_entrada - Fecha y hora exactas en que el vehículo ingresó al parqueadero.
   * @property {Date|null} fecha_salida - Fecha y hora exactas en que el vehículo salió del parqueadero (NULL si aún está dentro).
   * @property {number} id_usuario_entrada - Clave foránea que referencia al usuario (portero) que registró la entrada.
   * @property {number|null} id_usuario_salida - Clave foránea que referencia al usuario (portero) que registró la salida (NULL si aún está dentro).
   */
  const ParkingLog = sequelize.define(
    "ParkingLog",
    {
      id_registro: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_vehiculo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fecha_entrada: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      fecha_salida: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_usuario_entrada: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_usuario_salida: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      // Opciones del modelo
      tableName: "parqueadero_registros",
      timestamps: false,
      indexes: [
        {
          name: "idx_vehiculo_salida_null",
          fields: ["id_vehiculo", "fecha_salida"],
        },
        { name: "idx_fecha_entrada", fields: ["fecha_entrada"] },
      ],
    }
  );

  /**
   * @function associate
   * @static
   * @description Define las asociaciones del modelo ParkingLog con otros modelos.
   * Este método es llamado automáticamente por `models/index.js`.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  ParkingLog.associate = (models) => {
    /**
     * @description Asociación (belongsTo): Un registro de parqueadero pertenece a un Vehículo.
     * @param {Model} models.Vehicle - El modelo Vehicle.
     * @property {string} foreignKey - La clave foránea en `parqueadero_registros`.
     * @property {string} as - Alias para acceder al vehículo desde un registro (`parkingLogInstance.Vehicle`).
     * @property {string} onDelete - 'CASCADE': Si se borra un vehículo, se borran sus registros de historial.
     * @property {string} onUpdate - 'CASCADE': Si cambia el `id_vehiculo`, se actualiza aquí.
     */
    ParkingLog.belongsTo(models.Vehicle, {
      foreignKey: "id_vehiculo",
      as: "Vehicle",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    /**
     * @description Asociación (belongsTo): Un registro de parqueadero tiene un Usuario que registró la entrada.
     * @param {Model} models.User - El modelo User.
     * @property {string} foreignKey - La clave foránea `id_usuario_entrada`.
     * @property {string} as - Alias para acceder al usuario de entrada (`parkingLogInstance.EntryUser`).
     * @property {string} onDelete - 'RESTRICT': Previene borrar un usuario si tiene registros de entrada asociados.
     * @property {string} onUpdate - 'CASCADE': Si cambia el `id_usuario`, se actualiza aquí.
     */
    ParkingLog.belongsTo(models.User, {
      foreignKey: "id_usuario_entrada",
      as: "EntryUser",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });

    /**
     * @description Asociación (belongsTo): Un registro de parqueadero puede tener un Usuario que registró la salida.
     * @param {Model} models.User - El modelo User.
     * @property {string} foreignKey - La clave foránea `id_usuario_salida`.
     * @property {string} as - Alias para acceder al usuario de salida (`parkingLogInstance.ExitUser`).
     * @property {string} onDelete - 'SET NULL': Si se borra el usuario, el `id_usuario_salida` se pone a NULL.
     * @property {string} onUpdate - 'CASCADE': Si cambia el `id_usuario`, se actualiza aquí.
     */
    ParkingLog.belongsTo(models.User, {
      foreignKey: "id_usuario_salida",
      as: "ExitUser",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  };

  // Devuelve el constructor del modelo definido
  return ParkingLog;
};
