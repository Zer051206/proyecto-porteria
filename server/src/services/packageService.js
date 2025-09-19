import * as packageModel from "../models/packageModel.js";
import {
  DuplicateGuideError,
  PackageCreateError,
  PackageError,
} from "../utils/customErrors.js";

/**
 * @file - This file contains the business logic for package-related operations.
 * @author M.M
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
    const receivedPackage = await packageModel.createReceivedPackage(
      packageData
    );

    if (!receivePackage) {
      throw new PackageCreateError();
    }
    return receivedPackage;
  } catch (error) {
    if (error instanceof PackageError) {
      throw error;
    }
    throw new PackageError("Error en la base de datos al procesar el paquete.");
  }
};

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
    if (error instanceof PackageError) {
      throw error;
    }
    throw new PackageError("Error en la base de datos al procesar el paquete.");
  }
};
