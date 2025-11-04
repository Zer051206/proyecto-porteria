/**
 * @file packageRoutes.js
 * @module packageRoutes
 * @description Define las rutas para las operaciones de recepción y envío de paquetes.
 * Todas las rutas están protegidas con el middleware de autenticación (``).
 */
import { Router } from "express";
import * as packageController from "../controllers/packageController.js";

const router = Router();

/**
 * @route POST /paquetes/recibir
 * @description Registra la recepción de un nuevo paquete en el sistema.
 * @access Private
 * @middleware  - Requiere autenticación.
 * @handler packageController.receivePackage
 */
router.post("/recibir", packageController.receivePackage);

/**
 * @route POST /paquetes/enviar
 * @description Registra el envío o despacho de un paquete.
 * @access Private
 * @middleware  - Requiere autenticación.
 * @handler packageController.sendPackage
 */
router.post("/enviar", packageController.sendPackage);

/**
 * @route GET /paquetes/recientes
 * @description Obtiene una lista de los paquetes registrados más recientemente.
 * Acepta un query parameter opcional `limit` para especificar cuántos obtener (ej. /paquetes/recientes?limit=5).
 * @access Private
 * @middleware  - Requiere autenticación.
 * @handler packageController.recentPackages
 */
router.get("/recientes", packageController.recentPackages);

/**
 * @description Exporta el enrutador de Express configurado con las rutas de gestión de paquetes.
 * @type {Router}
 */
export default router;
