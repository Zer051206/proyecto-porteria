import { Router } from "express";
import * as apiController from '../controllers/apiController.js';

const router = Router();

router.get('/areas', apiController.getAreas)

router.get('/tipos-identificacion', apiController.getTiposIdentificacion)

router.get('/visitas-activas', apiController.getActiveVisits);