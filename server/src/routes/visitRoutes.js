/**
 * @file visitRoutes.js
 * @module visitRoutes
 * @description Define las rutas para el registro de entrada y salida de visitantes.
 * Todas las rutas requieren autenticación (`authMiddleware`).
 */
import * as visitController from "../controllers/visitController.js";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @route POST /visitas/entrada
 * @description Registra la entrada de un nuevo visitante al sistema.
 * Espera los datos del formulario de visita, incluyendo la firma digital en Base64.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @handler visitController.createVisit
 */
router.post("/entrada", authMiddleware, visitController.createVisit);

/**
 * @route PATCH /visitas/salida/:id
 * @description Registra la hora de salida de una visita activa específica (identificada por su ID).
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @param {string} id - El ID de la visita a la que se le registrará la salida.
 * @handler visitController.updateVisitExit
 */
router.patch("/salida/:id", authMiddleware, visitController.updateVisitExit);

/**
 * @description Exporta el enrutador de Express configurado con las rutas de gestión de visitas.
 * @type {Router}
 */
export default router;
