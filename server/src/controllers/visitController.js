/**
 * @file visitController.js
 * @module visitController
 * @description Controladores para las operaciones de gestión de visitas (entrada y salida).
 * Maneja la validación de datos, la persistencia de archivos (firmas en Base64),
 * la inyección de metadatos de auditoría y la lógica de rollback del archivo si la DB falla.
 */
import { visitEntrySchema } from "../schemas/visitSchema.js";
import * as visitService from "../services/visitService.js";
import { NotFoundError, InvalidIdError } from "../utils/customErrors.js";
import fs from "fs/promises";
import path from "path";
import logger from "../config/logger.js";

/**
 * @const {string} SIGNATURES_DIR
 * @description Ruta absoluta al directorio donde se guardarán los archivos de firma (PNG).
 */
const SIGNATURES_DIR = path.join(process.cwd(), "public", "signatures");

/**
 * @async
 * @function ensureDirExists
 * @description Función auxiliar para asegurar que el directorio de firmas exista.
 * Crea la ruta recursivamente si es necesario.
 * @param {string} dir - La ruta del directorio a verificar/crear.
 * @returns {Promise<void>}
 */
const ensureDirExists = async (dir) => {
  try {
    await fs.access(dir);
  } catch (error) {
    await fs.mkdir(dir, { recursive: true });
  }
};

/**
 * @async
 * @function createVisit
 * @description Registra la entrada de un visitante. Valida los datos, decodifica la firma
 * Base64 y la guarda en el sistema de archivos. Registra la visita con la ruta de la firma.
 * Implementa una lógica de *rollback* para eliminar el archivo de firma si el registro
 * en la base de datos falla.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 201 y el objeto de la nueva visita.
 * @throws {NotFoundError} Si el campo `firma_base64` está ausente.
 */
export const createVisit = async (req, res, next) => {
  const { firma_base64 } = req.body;

  // 1. Validación de datos de visita (excluyendo la firma)
  const validateVisitData = visitEntrySchema.safeParse(req.body);

  if (!validateVisitData.success) {
    // Si falla la validación del esquema Zod, pasamos el error.
    return next(validateVisitData.error);
  }

  // 2. Validación de la firma (obligatoria)
  if (!firma_base64) {
    throw new NotFoundError("No se encontró la firma");
  }

  const id_usuario = req.user.id_usuario;
  const ip_usuario = req.ip;

  /**
   * @type {string | null}
   * @description Ruta relativa del archivo guardado que se persistirá en la DB. Usado para el rollback.
   */
  let signaturePathDB = null;

  try {
    // 3. Procesamiento y guardado de la firma
    const base64Image = firma_base64.split(";base64,").pop();

    const uniqueID = Math.random().toString(36).substring(2, 8);
    const filename = `firma-${Date.now()}-${uniqueID}.png`;
    const filePath = path.join(SIGNATURES_DIR, filename);

    await ensureDirExists(SIGNATURES_DIR);
    await fs.writeFile(filePath, base64Image, { encoding: "base64" });

    // Ruta a guardar en la base de datos
    signaturePathDB = `/signatures/${filename}`;

    // 4. Preparación de los datos de auditoría
    const visitData = {
      ...validateVisitData.data,
      path_firma: signaturePathDB,
      id_usuario: id_usuario,
      ip_usuario: ip_usuario,
    };

    // 5. Registro en la base de datos
    const newVisit = await visitService.createVisit(visitData);

    return res.status(201).json({
      message: "Visita registrada con éxito.",
      visit: newVisit,
    });
  } catch (error) {
    // 6. Lógica de ROLLBACK (si el archivo se guardó pero la DB falló)
    if (signaturePathDB) {
      /**
       * @description Intenta eliminar el archivo de firma del disco para evitar archivos huérfanos.
       * El .catch(() => {}) previene que falle la eliminación si el archivo ya no existe.
       */
      await fs
        .unlink(path.join(process.cwd(), "public", signaturePathDB))
        .catch(() => {});
    }
    next(error);
  }
};

/**
 * @async
 * @function updateVisitExit
 * @description Registra la salida de un visitante activo. Requiere el ID de la visita en los parámetros
 * de la ruta. Inyecta metadatos de auditoría para el registro de salida.
 * @param {object} req - Objeto de solicitud de Express (contiene req.params.id, req.user, req.ip).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y el objeto de la visita actualizada.
 * @throws {InvalidIdError} Si el ID de la visita no es un número entero positivo.
 */
export const updateVisitExit = async (req, res, next) => {
  try {
    const visitId = parseInt(req.params.id, 10);

    const userId = req.user.userId;
    const userIp = req.ip;

    // Validación del ID de la ruta
    if (isNaN(visitId) || visitId <= 0) {
      throw new InvalidIdError(
        "El Id proporcionado de la visita no es válido."
      );
    }

    const visitData = {
      visitId,
      id_usuario: userId,
      ip_usuario: userIp,
    };

    const updateVisit = await visitService.updateVisitExit(visitData);

    return res.status(200).json({
      message: "Salida de visita registrada con éxito.",
      visit: updateVisit,
    });
  } catch (error) {
    next(error);
  }
};
