/**
 * @file packageController.js
 * @module packageController
 * @description Controladores para las operaciones de gestión de paquetes: recepción y envío.
 * Se encarga de la validación de la carga útil con Zod y de inyectar metadatos de seguridad
 * (ID de usuario e IP) a los datos antes de llamar al servicio.
 */
import * as packageService from "../services/packageService.js";
import {
  createReceivePackageSchema,
  createSendPackageSchema,
} from "../schemas/packageSchema.js";

/**
 * @async
 * @function receivePackage
 * @description Registra la recepción de un nuevo paquete. Valida el cuerpo de la solicitud
 * utilizando `createReceivePackageSchema`. Adjunta el ID del usuario autenticado y su IP.
 * @param {object} req - Objeto de solicitud de Express (contiene req.body, req.user, req.ip).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 201 y mensaje de éxito si el registro es válido.
 */
export const receivePackage = async (req, res, next) => {
  try {
    const validateData = createReceivePackageSchema.safeParse(req.body);

    if (!validateData.success) {
      // Manejo detallado de errores de validación de Zod
      const error = new Error("Error de validación de datos.");
      error.errors = validateData.error;
      error.status = 400; // Código 400 para errores de validación
      return next(error);
    }

    const userId = req.user.userId;
    const userIp = req.ip;

    /**
     * @const {object} packageData - Datos del paquete validados más metadatos de auditoría.
     */
    const packageData = {
      ...validateData.data,
      id_usuario: userId,
      ip_usuario: userIp,
    };

    await packageService.receivePackage(packageData);

    return res.status(201).json({
      success: true,
      message: "Paquete recibido con éxito.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function sendPackage
 * @description Registra el envío o despacho de un paquete. Valida el cuerpo de la solicitud
 * utilizando `createSendPackageSchema`. Adjunta el ID del usuario autenticado y su IP.
 * @param {object} req - Objeto de solicitud de Express (contiene req.body, req.user, req.ip).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 201 y mensaje de éxito si el registro es válido.
 */
export const sendPackage = async (req, res, next) => {
  try {
    const validateData = createSendPackageSchema.safeParse(req.body);

    if (!validateData.success) {
      // Manejo detallado de errores de validación de Zod
      const error = new Error("Error de validación de datos.");
      error.errors = validateData.error;
      error.status = 400; // Código 400 para errores de validación
      return next(error);
    }

    const userId = req.user.userId;
    const userIp = req.ip;

    /**
     * @const {object} packageData - Datos del paquete validados más metadatos de auditoría.
     */
    const packageData = {
      ...validateData.data,
      id_usuario: userId,
      ip_usuario: userIp,
    };

    await packageService.sendPackage(packageData);

    return res.status(201).json({
      success: true,
      message: "Paquete enviado con éxito.",
    });
  } catch (error) {
    next(error);
  }
};
