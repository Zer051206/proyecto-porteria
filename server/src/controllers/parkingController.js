import {
  createVehiclesSchema,
  updateVehicleSchema,
} from "../schemas/vehicleSchema.js";
import * as parkingService from "../services/parkingService.js";

/**
 * @async
 * @function getOccupancyController
 * @description Controlador para obtener la ocupación actual del parqueadero.
 * Llama al servicio `parkingService.getOccupancy`.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función middleware para pasar errores.
 * @returns {Promise<void>} Responde con 200 y el objeto de ocupación, o pasa el error.
 */
export const getOccupancyController = async (req, res, next) => {
  try {
    const occupancyData = await parkingService.getOccupancy();
    return res.status(200).json({
      success: true,
      message: "Ocupación obtenida exitosamente.",
      data: occupancyData,
    });
  } catch (error) {
    next(error); // Pasa errores al middleware global
  }
};

/**
 * @async
 * @function getAllVehicles
 * @description Controlador para obtener la lista de todos los vehículos activos registrados.
 * Llama al servicio `parkingService.getAllVehicles`.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función middleware para pasar errores.
 * @returns {Promise<void>} Responde con 200 y la lista de vehículos, o pasa el error.
 */
export const getAllActiveVehicles = async (req, res, next) => {
  try {
    const user = req.user;
    const allVehicles = await parkingService.getAllActiveVehicles(user);

    return res.status(200).json({
      message: "Vehiculos obtenimos exitosamente.",
      success: true,
      vehicles: allVehicles,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function createVehicle
 * @description Controlador para crear uno o más vehículos nuevos en el sistema.
 * Valida el cuerpo de la solicitud (un array de vehículos) usando `createVehiclesSchema`.
 * Llama al servicio para realizar la creación.
 * @param {object} req - Objeto de solicitud de Express. `req.body` debe ser un array de objetos vehículo.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función middleware para pasar errores.
 * @returns {Promise<void>} Responde con 201 y los vehículos creados, o pasa el error al middleware.
 */
export const createVehicle = async (req, res, next) => {
  try {
    const user = req.user;
    const ip = req.ip;

    const validateData = createVehiclesSchema.safeParse(req.body);
    const validationResult = createVehiclesSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos.",
        errors: validationResult.error.fieldErrors,
      });
    }

    const createdVehicle = await parkingService.createVehicle(
      user,
      validateData,
      ip
    );

    return res.status(201).json({
      message: "Vehiculo(s) creado(s) exitosamente.",
      success: true,
      vehicle: createdVehicle,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function updateVehicle
 * @description Controlador para actualizar los detalles generales de un vehículo existente.
 * Valida los datos parciales del vehículo en `req.body` usando `updateVehicleSchema`.
 * Llama al servicio `parkingService.updateVehicleDetails`.
 * @param {object} req - Objeto de solicitud de Express. `req.params.id` es el ID del vehículo, `req.body` contiene los campos a actualizar.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función middleware para pasar errores.
 * @returns {Promise<void>} Responde con 200 y el vehículo actualizado, o pasa el error al middleware.
 */
export const updateVehicle = async (req, res, next) => {
  try {
    const id_vehiculo = parseInt(req.params.id, 10);
    const user = req.user;
    const ip = req.ip;
    const validateData = updateVehicleSchema.parse(req.body);
    const updateData = {
      validateData,
      id_vehiculo,
      user,
      ip,
    };

    const updatedVehicle = await parkingService.updateVehicle(updateData);

    return res.status(200).json({
      message: "Vehiculo actualizado exitosamente.",
      success: true,
      vehicle: updatedVehicle,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function registerEntry
 * @description Controlador para registrar la entrada de un vehículo **existente**.
 * Espera el `id_vehiculo` en el cuerpo de la solicitud.
 * Llama al servicio `parkingService.registerEntry`.
 * @param {object} req - Objeto de solicitud de Express. `req.body` debe contener `{ id_vehiculo: number }`.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función middleware para pasar errores.
 * @returns {Promise<void>} Responde con 200 y el log de entrada, o pasa el error al middleware.
 */
export const registerEntry = async (req, res, next) => {
  try {
    const user = req.user;
    const ip = req.ip;
    const { id_vehiculo } = req.body;
    const entryData = {
      user,
      ip,
      id_vehiculo,
    };

    await parkingService.registerEntry(entryData);

    return res.status(200).json({
      message: "Se registró la entrada del vehículo exitosamente.",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function registerExit
 * @description Controlador para registrar la salida de un vehículo.
 * Llama al servicio `parkingService.registerExit`.
 * @param {object} req - Objeto de solicitud de Express. `req.params.id` contiene el id_vehiculo.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función middleware para pasar errores.
 * @returns {Promise<void>} Responde con 200 y mensaje de éxito, o pasa el error al middleware.
 */
export const registerExit = async (req, res, next) => {
  try {
    const user = req.user;
    const ip = req.ip;
    const id_vehiculo = parseInt(req.params.id, 10);
    const exitData = {
      user,
      ip,
      id_vehiculo,
    };

    await parkingService.registerExit(exitData);

    return res.status(200).json({
      message: "Se registró la salida del vehículo exitosamente.",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
