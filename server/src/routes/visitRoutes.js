import * as visitController from "../controllers/visitController.js";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { success } from "zod";
import { VisitError } from "../utils/customErrors.js";

/**
 * @file - // * This file contains the visit management routes.
 * @author M.M
 */

const handleErrors = (err, req, res, next) => {
  console.log(err);

  if (err.name == "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Error de validacion",
      errors: err.errors,
    });
  }

  if (err instanceof VisitError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Error interno en la aplicación",
  });
};

const router = Router();

router.post("/entrada", authMiddleware, visitController.createVisit);

router.patch("/salida/:id", authMiddleware, visitController.updateVisitExit);

router.use(handleErrors);

export default router;
