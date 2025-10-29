/**
 * @file parkingRoutes.js
 * @module Routes/Parking
 * @description Define las rutas para las operaciones del módulo de
 * (gestión de vehículos, registros de entrada/salida, ocupación y escaneo).
 * Aplica middlewares de autenticación según sea necesario (usuarios o API Key).
 * @requires express
 * @requires ../controllers/parkingController.js
 * @requires ../middlewares/authMiddleware.js // Middleware para usuarios autenticados
 * @requires ../middlewares/apiKeyAuth.js   // Middleware para validar API Key del sensor
 */
import { Router } from "express";
import * as parkingController from "../controllers/parkingController.js";
import apiKeyAuth from "../middlewares/apiKeyAuth.js";

const router = Router();

/**
 * @route GET /api/parqueadero/vehiculos
 * @description Obtiene la lista de todos los vehículos activos registrados.
 * Llama al controlador `getAllVehiclesController`.
 * @access Private - Requiere autenticación.
 */
router.get("/vehiculos", parkingController.getAllActiveVehicles);

/**
 * @route POST /api/parqueadero/vehiculos
 * @description Crea uno o más vehículos nuevos en el sistema.
 * Espera un array de objetos vehículo en el cuerpo de la solicitud.
 * Llama al controlador `createVehicles`.
 * @access Private - Requiere autenticación.
 * @body {Array<object>} vehiclesData - Array con los datos de los vehículos a crear.
 */
router.post("/vehiculos", parkingController.createVehicles);

/**
 * @route PATCH /api/parqueadero/vehiculos/:id
 * @description Actualiza los detalles generales de un vehículo específico.
 * Llama al controlador `updateVehicle`.
 * @access Private - Requiere autenticación.
 * @param {number} id - El ID del vehículo a actualizar (en `req.params.id`).
 * @body {object} dataToUpdate - Objeto con los campos del vehículo a modificar.
 */
router.patch("/vehiculos/:id", parkingController.updateVehicle);

// --- Rutas para Operaciones de Parqueadero---

/**
 * @route POST /api/parqueadero/vehiculos/entrada
 * @description Registra la entrada de un vehículo **existente**.
 * Espera el ID del vehículo en el cuerpo de la solicitud.
 * Llama al controlador `registerEntry`.
 * @access Private - Requiere autenticación.
 * @body {{ id_vehiculo: number }} - Objeto con el ID del vehículo que entra.
 */
router.post("/vehiculos/entrada", parkingController.registerEntry);

/**
 * @route PATCH /api/parqueadero/vehiculos/salida/:id
 * @description Registra la salida de un vehículo específico.
 * Llama al controlador `registerExit`.
 * @access Private - Requiere autenticación.
 * @param {number} id - El ID del vehículo que sale (en `req.params.id`).
 */
router.patch("/vehiculos/salida/:id", parkingController.registerExit);

/**
 * @route GET /api/parqueadero/ocupacion
 * @description Obtiene la ocupación actual del por tipo de vehículo.
 * Llama al controlador `getOccupancyController`.
 * @access Private - Requiere autenticación.
 */
// Asegúrate que el controlador se llame getOccupancyController
router.get("/ocupacion", parkingController.getOccupancy);

/**
 * @route POST /api/parqueadero/scan
 * @description Endpoint para recibir el código de un sensor y registrar entrada/salida automáticamente.
 * Llama a un controlador `handleScan` (a crear).
 * @access Private - Requiere autenticación (del sensor o sistema intermedio).  // O un middleware específico para sensores
 * @body {{ codigo_sensor: string }} - El código leído por el sensor.
 */
router.post("/scan", apiKeyAuth, parkingController.handleScan);

/**
 * @description Exporta el enrutador de Express configurado con las rutas del módulo de.
 * @type {Router}
 */
export default router;
