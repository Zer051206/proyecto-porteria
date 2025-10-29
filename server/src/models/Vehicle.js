/**
 * @file Vehicle.js
 * @module Models
 * @description Define el modelo de Sequelize para la tabla 'vehiculos'.
 * Representa la información única de cada vehículo registrado en el sistema,
 * así como su estado actual dentro del parqueadero.
 * @requires sequelize
 */
import { DataTypes } from "sequelize";

/**
 * @function defineVehicleModel
 * @description Define y devuelve el modelo 'Vehicle' de Sequelize usando sequelize.define.
 * @param {Sequelize} sequelize - La instancia de Sequelize.
 * @returns {Model} El constructor del modelo 'Vehicle' definido.
 */
export default (sequelize) => {
  /**
   * @class Vehicle
   * @classdesc Modelo de Sequelize para la tabla `vehiculos`. Almacena datos identificativos
   * y el estado actual de cada vehículo (dentro/fuera, activo/inactivo).
   * @property {number} id_vehiculo - Clave primaria autoincremental.
   * @property {string|null} placa - Placa del vehículo. Única si no es NULL. Nulo para bicicletas.
   * @property {string} tipo_vehiculo - Tipo de vehículo ('Carro', 'Moto', 'Bicicleta', 'Otros').
   * @property {string|null} modelo_descripcion - Modelo o descripción adicional del vehículo (opcional).
   * @property {string} nombre_dueno - Nombre completo del dueño o conductor principal.
   * @property {string} identificacion_dueno - Número de identificación del dueño.
   * @property {string} genero_dueno - Género del dueño ('Masculino', 'Femenino', 'N/A'). Relevante para capacidad de motos.
   * @property {string|null} lugar_asignado_default - Descripción del lugar habitual de parqueo (opcional).
   * @property {boolean} esta_dentro - Indica si el vehículo está actualmente dentro del parqueadero (TRUE) o fuera (FALSE).
   * @property {boolean} activo - Indica si el vehículo está activo en el sistema (TRUE) o desactivado (FALSE).
   * @property {string|null} codigo_sensor - Código único asociado al tag/lector para identificación automática (opcional, único si no es NULL).
   */
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
        type: DataTypes.ENUM("Carro", "Moto", "Bicicleta", "Otros"),
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
   * @description Define las asociaciones del modelo Vehicle con otros modelos.
   * @param {object} models - Un objeto que contiene todos los modelos de la aplicación.
   */
  Vehicle.associate = (models) => {
    /**
     * @description Asociación (hasMany): Un Vehículo puede tener muchos registros en el historial de parqueadero.
     * @param {Model} models.ParkingLog - El modelo ParkingLog.
     * @property {string} foreignKey - La clave foránea en la tabla `parqueadero_registros`.
     * @property {string} as - Alias para acceder a los registros desde una instancia de vehículo (`vehicleInstance.getParkingLogs()`).
     */
    Vehicle.hasMany(models.ParkingLog, {
      foreignKey: "id_vehiculo",
      as: "ParkingLogs",
    });
  };

  // Devuelve el constructor del modelo definido
  return Vehicle;
};
