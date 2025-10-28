import { Router } from "express";
import * as parkingController from "../controllers/parkingController.js";

const router = Router();

router.get("/vehiculos", parkingController.getAllActiveVehicles);

router.post("/vehiculos", parkingController.createVehicle);

router.patch("/vehiculos/:id", parkingController.updateVehicle);

router.patch("/vehiculos/entrada", parkingController.registerEntry);

router.patch("/vehiculos/salida/:id", parkingController.registerExit);

export default router;
