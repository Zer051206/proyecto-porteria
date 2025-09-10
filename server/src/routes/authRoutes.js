import * as authController from '../controllers/authController.js'
import { Router } from 'express'

/**
 * @file - // * This file contains the authentication routes.
 * @author M.M
 */

const router = Router()

router.post('/register', authController.registerUser)

router.post('/login', authController.loginUser)

export default router;