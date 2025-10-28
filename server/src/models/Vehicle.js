/**
 * @file Vehicle.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'vehiculos'.
 * Representa la información única de cada vehículo registrado en el sistema.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineVehicleModel
 * @description Define y devuelve el modelo 'Vehicle' de Sequelize usando sequelize.define.
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').ModelCtor<Model>} El constructor del modelo 'Vehicle' definido.
 */
export default (sequelize) => {
  // Define el modelo usando sequelize.define
  const Vehicle = sequelize.define(
    "Vehicle",
    {
      // Definición de las columnas de la tabla 'vehiculos'
      id_vehiculo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      placa: {
        type: DataTypes.STRING(10),
        allowNull: true,
        unique: true,
      },
      tipo_vehiculo: {
        type: DataTypes.ENUM("Carro", "Moto", "Bicicleta"),
        allowNull: false,
      },
      modelo_descripcion: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      nombre_dueno: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      identificacion_dueno: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      genero_dueno: {
        type: DataTypes.ENUM("Masculino", "Femenino", "N/A"),
        allowNull: false,
        defaultValue: "N/A",
      },
      lugar_asignado_default: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      esta_dentro: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      codigo_sensor: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
    },
    {
      // Opciones del modelo
      tableName: "vehiculos",
      timestamps: false,
      indexes: [
        {
          name: "idx_estado_tipo_genero",
          fields: ["esta_dentro", "tipo_vehiculo", "genero_dueno"],
        },
        {
          name: "idx_identificacion",
          fields: ["identificacion_dueno"],
        },
        {
          name: "idx_placa_activo_estado",
          fields: ["placa", "activo", "esta_dentro"],
        },
      ],
    }
  );

  /**
   * @function associate
   * @static
   * @description Define las asociaciones del modelo Vehicle con otros modelos.
   * Este método es llamado automáticamente por `models/index.js`.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  Vehicle.associate = (models) => {
    // Asociación HACIA ParkingLog (Un Vehículo tiene muchos Registros de Parqueo)
    Vehicle.hasMany(models.ParkingLog, {
      foreignKey: "id_vehiculo",
      as: "ParkingLogs",
    });
  };

  // Devuelve el constructor del modelo definido
  return Vehicle;
};
