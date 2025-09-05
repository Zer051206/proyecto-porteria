import * as visitController from '../controllers/visitController';
import { Router } from 'express';

const router = Router();

router.post('/entrada', visitController)