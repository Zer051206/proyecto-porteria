import * as packageService from "../services/packageService.js";
import {
  packageSchemaReceive,
  packageSchemaSend,
} from "../schemas/packageSchema.js";

export const receivePackage = async (req, res, next) => {
  try {
    const validateData = packageSchemaReceive.safeParse(req.body);

    if (!validateData.success) {
      const error = new Error("Error de validación de datos.");
      error.errors = validateData.error.errors;
      error.status = 400; // Código 400 para errores de validación
      return next(error);
    }

    const userId = req.user.userId;

    const userIp = req.ip;

    const packageData = {
      ...validateData.data,
      id_usuario: userId,
      ip_usuario: userIp,
    };

    const receivedPackage = await packageService.receivePackage(packageData);

    return res.status(201).json({
      success: true,
      message: "Paquete recibido con éxito.",
      receivedPackage,
    });
  } catch (error) {
    next(error);
  }
};

export const sendPackage = async (req, res) => {
  try {
    const validateData = packageSchemaSend.safeParse(req.body);

    if (!validateData.success) {
      const error = new Error("Error de validación de datos.");
      error.errors = validateData.error.errors;
      error.status = 400; // Código 400 para errores de validación
      return next(error);
    }

    const userId = req.user.userId;

    const userIp = req.ip;

    const packageData = {
      ...validateData.data,
      id_usuario: userId,
      ip_usuario: userIp,
    };

    const sentPackage = await packageService.sendPackage(packageData);

    return res.status(201).json({
      success: true,
      message: "Paquete enviado con éxito.",
      sentPackage,
    });
  } catch (error) {
    next(error);
  }
};
