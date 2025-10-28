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
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').ModelCtor<Model>} El constructor del modelo 'ParkingLog' definido.
 */
export default (sequelize) => {
  // Define el modelo usando sequelize.define
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
    // Asociación HACIA Vehiculo
    ParkingLog.belongsTo(models.Vehicle, {
      // Asume modelo 'Vehicle'
      foreignKey: "id_vehiculo",
      as: "Vehicle",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Asociación HACIA Usuario (Entrada)
    ParkingLog.belongsTo(models.User, {
      foreignKey: "id_usuario_entrada",
      as: "EntryUser",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });

    // Asociación HACIA Usuario (Salida)
    ParkingLog.belongsTo(models.User, {
      foreignKey: "id_usuario_salida",
      as: "ExitUser",
      allowNull: true,
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  };

  // Devuelve el constructor del modelo definido
  return ParkingLog;
};
