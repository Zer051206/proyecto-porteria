import * as packageService from '../services/packageService.js';
import { packageSchemaReceive, packageSchemaSend } from '../schemas/packageSchema.js';

export const receivePackage = async (req, res) => {
  try {
    const validateData = packageSchemaReceive.safeParse(req.body);
    
    if (!validateData.success) {
      const errors = validateData.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({ 
        success: false,
        errors 
      });
    }

    const userId = req.user.userId;

    const userIp = req.ip

    const packageData = {
      ...validateData,
      id_usuario: userId,
      ip_usuario: userIp
    }

    const receivedPackage = await packageService.receivePackage(packageData);
    
    return res.status(201).json({
      success: true, 
      message: 'Paquete recibido con éxito.',
      data: receivedPackage
    });
  } catch (error) {
    return res.status(500).json({
      success: false, 
      message: 'Error interno del servidor al procesar el paquete.'
    });
  }
};

export const sendPackage = async (req, res) => {
  try {
    const validateData = packageSchemaSend.safeParse(req.body);
    
    if (!validateData.success) {
      const errors = validateData.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        errors
      });
    }

    const userId = req.user.userId;

    const userIp = req.ip;

    const packageData = {
      ...validateData,
      id_usuario: userId,
      ip_usuario: userIp
    }

    const sentPackage = await packageService.sendPackage(packageData);
    
    return res.status(201).json({
      success: true,
      message: 'Paquete enviado con éxito.', sentPackage
    });
  } catch (error) {
    return res.status(500).json({
      success: false, 
      message: 'Error interno del servidor al procesar el paquete.'
    });
  }
};