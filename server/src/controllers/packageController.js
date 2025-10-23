/**
 * @file packageController.js
 * @module packageController
 * @description Controladores para las operaciones de gestión de paquetes: recepción y envío.
 * Se encarga de la validación de la carga útil con Zod y de inyectar metadatos de seguridad
 * (ID de usuario e IP) a los datos antes de llamar al servicio.
 */
import * as packageService from "../services/packageService.js";
import {
  receivePackageSchema,
  sendPackageSchema,
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
    const validateData = receivePackageSchema.safeParse(req.body);

    const userId = req.user.id_usuario;
    const userIp = req.ip;

    /**
     * @const {object} packageData - Datos del paquete validados más metadatos de auditoría.
     */
    const packageData = {
      ...validateData.data,
      id_usuario: userId,
      ip_usuario: userIp,
    };

    await packageService.createPackage(packageData);

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
    const validateData = sendPackageSchema.safeParse(req.body);

    const userId = req.user.id_usuario;
    const userIp = req.ip;

    /**
     * @const {object} packageData - Datos del paquete validados más metadatos de auditoría.
     */
    const packageData = {
      ...validateData.data,
      id_usuario: userId,
      ip_usuario: userIp,
    };

    await packageService.createPackage(packageData);

    return res.status(201).json({
      success: true,
      message: "Paquete enviado con éxito.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function recentPackages
 * @description Obtiene los paquetes registrados más recientemente. Valida el parámetro `limit`.
 * Llama al servicio `packageService.getRecentPackages` para obtener los datos.
 * @param {object} req - Objeto de solicitud de Express (contiene req.query.limit).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y la lista de paquetes recientes.
 */
export const recentPackages = async (req, res, next) => {
  try {
    const user = req.user;
    // Obtener y validar el límite
    const limitParam = req.query.limit;
    let limit = 5; // Valor por defecto
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      // Validar que sea un número positivo
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = parsedLimit;
      } else {
        return res.status(400).json({
          success: false,
          message: "Parámetro 'limit' inválido. Debe ser un número positivo.",
        });
      }
    }

    // Llama al servicio para obtener los paquetes recientes
    const recentPackagesList = await packageService.getRecentPackages(
      limit,
      user
    ); // Cambiado nombre de servicio

    return res.status(200).json({
      success: true,
      message: "Paquetes recientes obtenidos exitosamente.",
      data: recentPackagesList, // Es buena práctica usar 'data' como clave
    });
  } catch (error) {
    next(error); // Pasa errores al manejador global
  }
};
