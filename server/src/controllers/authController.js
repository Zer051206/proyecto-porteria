import { ZodError } from 'zod';
import { registerSchema, loginSchema, oauthSchema } from '../schemas/authSchema.js'
import * as authService from "../services/authService.js"
import passport from 'passport'

export const registerUser = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const newUser = await authService.registerUser(validatedData);
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const token = await authService.loginUser(validatedData);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // ^ 1 hour
    });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        correo: validatedData.correo,
        nombre: validatedData.nombre,
        apellido: validatedData.apellido
      }
    });
    
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

export const handleGoogleCallback = async (req, res, next) => {
  try {
    const oauthData = oauthSchema.parse(req.user);
    const token = await authService.handleOauthLogin(oauthData);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}

export const handleMicrosoftCallback = async (req, res, next) => {
  try {
    const oauthData = oauthSchema.parse(req.user);
    const token = await authService.handleOauthLogin(oauthData);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}

export const redirectToGoogle = () => {
  
}

export const redirectToMicrosoft = () => {
  
}