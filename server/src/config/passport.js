// server/config/passport.js

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import * as userModel from '../models/userModel.js';
import * as authService from '../services/authService.js'; 
import dotenv from 'dotenv';

dotenv.config();

// Guarda el ID del usuario en la sesión para la cookie
passport.serializeUser((user, done) => {
  done(null, user.id_usuario);
});

// Busca el usuario en la base de datos por el ID de la sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id); 
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Estrategia de Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Extraemos los datos de Google
      const googleId = profile.id;
      const nombre = profile.name.givenName;
      const apellido = profile.name.familyName;
      const correo = profile.emails[0].value;

      // Llamamos al servicio para manejar la autenticación
      const token = await authService.handleOauthLogin({
        id_oauth: googleId,
        proveedor_oauth: 'google',
        nombre,
        apellido,
        correo,
      });

      // Devolvemos el token al controlador
      return done(null, { token });
    } catch (error) {
      return done(error, null);
    }
  }
));

// Estrategia de Microsoft
passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: process.env.MICROSOFT_CALLBACK_URL,
    scope: ['user.read']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Extraemos los datos de Microsoft
      const microsoftId = profile.id;
      const nombre = profile.name.givenName;
      const apellido = profile.name.familyName;
      const correo = profile.emails[0].value;

      // Llamamos al servicio para manejar la autenticación
      const token = await authService.handleOauthLogin({
        id_oauth: microsoftId,
        proveedor_oauth: 'microsoft',
        nombre,
        apellido,
        correo,
      });

      // Devolvemos el token al controlador
      return done(null, { token });
    } catch (error) {
      return done(error, null);
    }
  }
));