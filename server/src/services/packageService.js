import * as packageModel from '../models/packageModel.js';

/**
 * @file - This file contains the business logic for package-related operations.
 * @author M.M
 */

export const receivePackage = async (packageData) => {
  const { guia } = packageData;
  try {
    if(guia) {
      const isDuplicate = await packageModel.findPackageGuideReceive(guia);
      if (isDuplicate) {
        throw new Error('DUPLICATE_GUIDE');
      }
    }
    const receivedPackage = await packageModel.createReceivedPackage(packageData);

    if (!receivePackage) {
      throw new Error('CREATION_FAILED');
    }
    return receivedPackage;
  } catch (error) {
    if (error.message === 'DUPLICATE_GUIDE') {
      throw new Error('Un paquete con la misma guía ya existe en el sistema.');
    }
    if (error.message === 'CREATION_FAILED') {
      throw new Error('No se pudo registrar el paquete recibido.');
    }
    if (error.message.includes('Error en la consulta')) {
      throw new Error('Error en la base de datos al procesar el paquete.');
    }
    throw error;
  }
};

export const sendPackage = async (packageData) => {
  const { guia } = packageData;
  try {
    const packageGuide = await packageModel.findPackageGuideSend(guia);
    if (packageGuide) {
      throw new Error('DUPLICATE_GUIDE');
    }
    const sentPackage = await packageModel.createSentPackage(packageData);

    if (!sentPackage) {
      throw new Error('CREATION_FAILED');
    }
    return sentPackage;
  } catch (error) {
    if (error.message === 'DUPLICATE_GUIDE') {
      throw new Error('Un paquete con la misma guía ya existe en el sistema.');
    }
    if (error.message === 'CREATION_FAILED') {
      throw new Error('No se pudo registrar el envío del paquete.');
    }
    if (error.message.includes('Error en la consulta')) {
      throw new Error('Error en la base de datos al procesar el paquete.')
    }
    throw error;
  }
};