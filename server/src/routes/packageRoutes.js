import { Router } from 'express';
import * as packageController from '../controllers/packageController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

/**
 * @file - // * This file contains the package management routes.
 * @author M.M
 */

const router = Router();

router.post('/recibir', authMiddleware, packageController.receivePackage);

router.post('/enviar',  authMiddleware, packageController.sendPackage);

export default router;