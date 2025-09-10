import * as packageService from '../services/packageService.js';
import { packageSchemaReceive, packageSchemaSend } from '../schemas/packageSchema.js';

export const receivePackage = async (req, res) => {
  const validateData = packageSchemaReceive.safeParse(req.body);
  try {
    if (!validateData.success) {
      const errors = validateData.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({ errors });
    }
    const receivePackage = await packageService.receivePackage(validateData.data);
    return res.status(201).json({ 
      message: 'Paquete recibido con éxito.',
      package: receivePackage 
    });
  } catch (error) {
    throw new Error('Error en la consulta a la base de datos: ' + error.message);
  }
};

export const sendPackage = async (req, res) => {
  const validateData = packageSchemaSend.safeParse(req.body);
  try {
    if (!validateData.success) {
      const errors = validateData.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({ errors });
    }; 
    const sendPackage = await packageService.sendPackage(validateData.data);
    return res.status(201).json({ 
      message: 'Paquete enviado con éxito.',
      package: sendPackage 
    });
  } catch (error) {
      throw new Error('Error en la consulta a la base de datos: ' + error.message);
    }
};