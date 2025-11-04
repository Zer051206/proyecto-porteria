/**
 * @file apiRoutes.js
 * @module apiRoutes
 * @description Define todas las rutas generales de la API para obtener datos estáticos (catálogos)
 * y listados de historial. Todas las rutas requieren el middleware de autenticación (`authMiddleware`),
 * a excepción de la ruta para obtener el token CSRF.
 */
import { Router } from "express";
import * as apiController from "../controllers/apiController.js";

const router = Router();

/**
 * @route GET /api/status
 * @description Verifica el estado de la sesión activa del usuario.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 */
router.get("/status", (req, res) => {
  res.status(200).json({ message: "Sesión activa" });
});

/**
 * @route GET /api/areas
 * @description Obtiene el listado de todas las áreas de la empresa de la base de datos.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @handler apiController.getAreas
 */
router.get("/areas", apiController.getAreas);

/**
 * @route GET /api/tipos-identificacion
 * @description Obtiene el listado de tipos de identificación válidos.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @handler apiController.getIdentificationTypes
 */
router.get("/tipos-identificacion", apiController.getIdentificationTypes);

/**
 * @route GET /api/visitas-activas
 * @description Obtiene un listado de todas las visitas que se encuentran activas actualmente (aún no han terminado).
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @handler apiController.getActiveVisits
 */
router.get("/visitas-activas", apiController.getActiveVisits);

/**
 * @route GET /api/tipos-paquetes
 * @description Obtiene el listado de los tipos de paquetes.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @handler apiController.getPackageTypes
 */
router.get("/tipos-paquetes", apiController.getPackageTypes);

/**
 * @route GET /api/visitas
 * @description Obtiene el historial completo de todas las visitas registradas.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @handler apiController.getVisitsHistorial
 */
router.get("/historial/visitas", apiController.getVisitsHistorial);

/**
 * @route GET /api/paquetes
 * @description Obtiene el historial completo de todos los paquetes registrados.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 * @handler apiController.getPackagesHistorial
 */
router.get("/historial/paquetes", apiController.getPackagesHistorial);

router.get("/historial/parqueadero", apiController.getParkingLogs);

/**
 * @route GET /api/historial/radicados
 * @description Obtiene el historial de todos los paquetes marcados como 'radicado'.
 * @access Private
 * @middleware authMiddleware
 */
router.get("/historial/radicados", apiController.getFiles);

/**
 * @route GET /api/historial/radicados/exportar
 * @description Genera y devuelve un archivo Excel (.xlsx) con el historial de radicados.
 * @access Private
 * @middleware authMiddleware
 */
router.get("/historial/radicados/exportar", apiController.exportFiles);

export default router;
