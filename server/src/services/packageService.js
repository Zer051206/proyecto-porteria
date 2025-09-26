/**
 * @file packageService.js
 * @module packageService
 * @description Capa de servicio para la gestión de paquetes, incluyendo la recepción y el envío.
 * Se encarga de la lógica de negocio, como la verificación de guías duplicadas.
 */
import * as packageModel from "../models/packageModel.js";
import {
  DuplicateGuideError,
  PackageCreateError,
  DatabaseConnectionError,
} from "../utils/customErrors.js";

/**
 * @async
 * @function receivePackage
 * @description Registra la recepción de un paquete. Verifica si el número de guía (si existe)
 * ya ha sido registrado como recibido.
 * @param {object} packageData - Datos del paquete, incluyendo metadatos de auditoría y la guía.
 * @returns {Promise<object>} Promesa que resuelve con el objeto del paquete creado.
 * @throws {DuplicateGuideError} Si la guía ya ha sido utilizada para un paquete recibido.
 * @throws {PackageCreateError} Si el modelo no retorna el paquete creado (fallo silencioso).
 * @throws {DatabaseConnectionError} Si ocurre un error de base de datos durante el proceso.
 */
export const receivePackage = async (packageData) => {
  const { guia } = packageData;
  try {
    if (guia) {
      const isDuplicate = await packageModel.findPackageGuideReceive(guia);
      if (isDuplicate) {
        throw new DuplicateGuideError();
      }
    }
    const receivedPackage = await packageModel.createReceivePackage(
      packageData
    );

    if (!receivedPackage) {
      throw new PackageCreateError();
    }
    return receivedPackage;
  } catch (error) {
    if (error.name === "DatabaseError") {
      throw new DatabaseConnectionError(
        "Error en la base de datos al procesar el paquete."
      );
    }
    throw error;
  }
};

/**
 * @async
 * @function sendPackage
 * @description Registra el envío o despacho de un paquete. Verifica si el número de guía
 * ya ha sido registrado como enviado.
 * @param {object} packageData - Datos del paquete, incluyendo metadatos de auditoría y la guía.
 * @returns {Promise<object>} Promesa que resuelve con el objeto del paquete creado.
 * @throws {DuplicateGuideError} Si la guía ya ha sido utilizada para un paquete enviado.
 * @throws {PackageCreateError} Si el modelo no retorna el paquete creado (fallo silencioso).
 * @throws {DatabaseConnectionError} Si ocurre un error de base de datos durante el proceso.
 */
export const sendPackage = async (packageData) => {
  const { guia } = packageData;
  try {
    const packageGuide = await packageModel.findPackageGuideSend(guia);
    if (packageGuide) {
      throw new DuplicateGuideError();
    }
    const sentPackage = await packageModel.createSentPackage(packageData);

    if (!sentPackage) {
      throw new PackageCreateError();
    }
    return sentPackage;
  } catch (error) {
    if (error.name === "DatabaseError") {
      throw new DatabaseConnectionError(
        "Error en la base de datos al procesar el paquete."
      );
    }
    throw error;
  }
};
