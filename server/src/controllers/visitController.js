//src/controllers/visitController.js
import { visitEntrySchema } from "../schemas/visitSchema.js";
import * as visitService from "../services/visitService.js";
import {
  SignatureDontExistsError,
  VisitIdInvalidError,
} from "../utils/customErrors.js";
import fs from "fs/promises";
import path from "path";

// Directorio donde se guardarán las firmas
const SIGNATURES_DIR = path.join(process.cwd(), "public", "signatures");

// Función auxiliar para asegurar que el directorio exista
const ensureDirExists = async (dir) => {
  try {
    await fs.access(dir);
  } catch (error) {
    await fs.mkdir(dir, { recursive: true });
  }
};

export const createVisit = async (req, res, next) => {
  const { firma_base64, ...restBody } = req.body;

  const validateVisitData = visitEntrySchema.safeParse(restBody);

  if (!validateVisitData.success) {
    return next(validateVisitData.error);
  }

  if (!firma_base64) {
    throw new SignatureDontExistsError();
  }

  const userId = req.user.userId;

  const userIp = req.ip;

  let signaturePathDB = null;

  try {
    const base64Image = firma_base64.split(";base64,").pop();

    const uniqueID = Math.random().toString(36).substring(2, 8);
    const filename = `firma-${Date.now()}-${uniqueID}.png`;
    const filePath = path.join(SIGNATURES_DIR, filename);

    await ensureDirExists(SIGNATURES_DIR);

    await fs.writeFile(filePath, base64Image, { encoding: "base64" });

    signaturePathDB = `/signatures/${filename}`;

    const visitData = {
      ...validateVisitData.data,
      path_firma: signaturePathDB,
      id_usuario: userId,
      ip_usuario: userIp,
    };

    const newVisit = await visitService.createVisit(visitData);

    return res.status(201).json({
      message: "Visita registrada con éxito.",
      visit: newVisit,
    });
  } catch (error) {
    if (signaturePathDB) {
      await fs
        .unlink(path.join(process.cwd(), "public", signaturePathDB))
        .catch(() => {});
    }
    next(error);
  }
};

export const updateVisitExit = async (req, res, next) => {
  try {
    const visitId = parseInt(req.params.id, 10);

    const userId = req.user.userId;

    const userIp = req.ip;

    if (isNaN(visitId) || visitId <= 0) {
      throw new VisitIdInvalidError();
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
