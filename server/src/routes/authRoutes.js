import * as authController from '../controllers/authController'
import { Router } from 'express'

const router = Router()

router.post('/register', authController.registerUser)

router.post('/login', authController.loginUser)

router.get('/google', authController.oauthUser)

router.get('/google/callback', authController.oauthUser)

router.get('/microsoft', authController.oauthUser)

router.get('/microsoft/callback', authController.oauthUser)