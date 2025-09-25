//src /routes/apiRoutes.js
import { Router } from "express";
import * as apiController from "../controllers/apiController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { csrfTokenMiddleware } from "../middlewares/csrfMiddleware.js";

const router = Router();

router.get("/csrf-token", csrfTokenMiddleware);

router.get("/status", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Sesión activa" });
});

router.get("/areas", authMiddleware, apiController.getAreas);

router.get(
  "/tipos-identificacion",
  authMiddleware,
  apiController.getTiposIdentificacion
);

router.get("/visitas-activas", authMiddleware, apiController.getActiveVisits);

router.get("/tipos-paquetes", authMiddleware, apiController.getTiposPaquetes);

router.get("/visitas", authMiddleware, apiController.getVisitsHistorial);

router.get("/paquetes", authMiddleware, apiController.getPackagesHistorial);

export default router;
