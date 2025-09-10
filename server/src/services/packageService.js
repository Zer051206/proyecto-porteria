import * as packageModel from '../models/packageModel.js';

/**
 * @file - This file contains the business logic for package-related operations.
 * @author M.M
 */

export const receivePackage = async (validatePackageData) => {
  const { guia } = validatePackageData;

  const packageGuide = await packageModel.findPackageGuideReceive(guia);

  if (packageGuide) {
    throw new Error('Un paquete con la misma guía ya existe en el sistema.');
  }

  const receivedPackage = await packageModel.createReceivedPackage(validatePackageData);

  if (!receivedPackage) {
    throw new Error('No se pudo registrar el paquete recibido.');
  }

  return receivedPackage;
};

export const sendPackage = async (validatePackageData) => {
  const { guia } = validatePackageData;

  const packageGuide = await packageModel.findPackageGuideSend(guia);

  if (packageGuide) {
    throw new Error('Un paquete con la misma guía ya existe en el sistema.');
  }

  const sentPackage = await packageModel.createSentPackage(validatePackageData);

  if (!sentPackage) {
    throw new Error('No se pudo registrar el paquete enviado.');
  }

  return sentPackage;
};