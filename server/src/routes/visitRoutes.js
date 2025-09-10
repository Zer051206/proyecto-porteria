import * as visitController from '../controllers/visitController.js';
import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';

/**
 * @file - // * This file contains the visit management routes.
 * @author M.M
 */

const router = Router();

router.post('/entrada', authMiddleware, visitController.createVisit);

router.patch('/salida/:id', authMiddleware, visitController.updateVisitExit);

export default router;