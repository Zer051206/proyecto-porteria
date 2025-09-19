import { Router } from "express";
import * as packageController from "../controllers/packageController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { PackageError } from "../utils/customErrors.js";

/**
 * @file - // * This file contains the package management routes.
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

  if (err instanceof PackageError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message,
  });
};

const router = Router();

router.post("/recibir", authMiddleware, packageController.receivePackage);

router.post("/enviar", authMiddleware, packageController.sendPackage);

router.use(handleErrors);

export default router;
