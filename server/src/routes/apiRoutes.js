/**
 * @file apiRoutes.js
 * @module apiRoutes
 * @description Define todas las rutas generales de la API para obtener datos estáticos (catálogos)
 * y listados de historial. Todas las rutas requieren el middleware de autenticación (`authMiddleware`),
 * a excepción de la ruta para obtener el token CSRF.
 */
import { Router } from "express";
import * as apiController from "../controllers/apiController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { csrfTokenMiddleware } from "../middlewares/csrfMiddleware.js";

const router = Router();

/**
 * @route GET /api/csrf-token
 * @description Endpoint para obtener el token CSRF, necesario para las peticiones POST, PUT y DELETE.
 * @access Public
 */
router.get("/csrf-token", csrfTokenMiddleware);

/**
 * @route GET /api/status
 * @description Verifica el estado de la sesión activa del usuario.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 */
router.get("/status", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Sesión activa" });
});

/**
 * @route GET /api/areas
 * @description Obtiene el listado de todas las áreas de la empresa de la base de datos.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @handler apiController.getAreas
 */
router.get("/areas", authMiddleware, apiController.getAreas);

/**
 * @route GET /api/tipos-identificacion
 * @description Obtiene el listado de tipos de identificación válidos.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @handler apiController.getTiposIdentificacion
 */
router.get(
  "/tipos-identificacion",
  authMiddleware,
  apiController.getTiposIdentificacion
);

/**
 * @route GET /api/visitas-activas
 * @description Obtiene un listado de todas las visitas que se encuentran activas actualmente (aún no han terminado).
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @handler apiController.getActiveVisits
 */
router.get("/visitas-activas", authMiddleware, apiController.getActiveVisits);

/**
 * @route GET /api/tipos-paquetes
 * @description Obtiene el listado de los tipos de paquetes.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @handler apiController.getTiposPaquetes
 */
router.get("/tipos-paquetes", authMiddleware, apiController.getTiposPaquetes);

/**
 * @route GET /api/visitas
 * @description Obtiene el historial completo de todas las visitas registradas.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @handler apiController.getVisitsHistorial
 */
router.get("/visitas", authMiddleware, apiController.getVisitsHistorial);

/**
 * @route GET /api/paquetes
 * @description Obtiene el historial completo de todos los paquetes registrados.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @handler apiController.getPackagesHistorial
 */
router.get("/paquetes", authMiddleware, apiController.getPackagesHistorial);

/**
 * @description Exporta el enrutador de Express configurado.
 * @type {Router}
 */
export default router;
