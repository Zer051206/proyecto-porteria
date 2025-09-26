/**
 * @file passport.js
 * @module passportConfig
 * @description Configuración central de Passport.js para la autenticación OAuth.
 * Define las estrategias de Google y Microsoft, y maneja la serialización y
 * deserialización de usuarios para la gestión de sesiones.
 */

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import * as userModel from "../models/userModel.js";
import * as authService from "../services/authService.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * @function serializeUser
 * @description Almacena el identificador único del usuario en la sesión/cookie de Express.
 * @param {object} user - Objeto de usuario que se va a serializar.
 * @param {function} done - Callback a llamar al finalizar la serialización.
 * @returns {void} Llama a `done(null, user.id_usuario)`.
 */
passport.serializeUser((user, done) => {
  done(null, user.id_usuario);
});

/**
 * @async
 * @function deserializeUser
 * @description Recupera el objeto de usuario completo a partir del ID almacenado en la sesión.
 * @param {number} id - El ID de usuario almacenado en la sesión.
 * @param {function} done - Callback a llamar al finalizar la deserialización.
 * @returns {Promise<void>} Llama a `done(null, user)` o `done(error, null)`.
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// --- ESTRATEGIAS OAUTH ---

/**
 * @strategy GoogleStrategy
 * @description Define la estrategia de autenticación para Google OAuth 2.0.
 * Utiliza `authService.handleOauthLogin` para gestionar el registro o login del usuario.
 * @param {string} accessToken - Token de acceso de Google.
 * @param {string} refreshToken - Token de refresco de Google.
 * @param {object} profile - Perfil de usuario devuelto por Google.
 * @param {function} done - Callback de Passport.
 * @returns {Promise<void>} Llama a `done(null, { token })` con el token JWT de la aplicación.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
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
          proveedor_oauth: "google",
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
  )
);

/**
 * @strategy MicrosoftStrategy
 * @description Define la estrategia de autenticación para Microsoft (Azure AD/Personal).
 * Utiliza `authService.handleOauthLogin` para gestionar el registro o login del usuario.
 * @param {string} accessToken - Token de acceso de Microsoft.
 * @param {string} refreshToken - Token de refresco de Microsoft.
 * @param {object} profile - Perfil de usuario devuelto por Microsoft.
 * @param {function} done - Callback de Passport.
 * @returns {Promise<void>} Llama a `done(null, { token })` con el token JWT de la aplicación.
 */
passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: process.env.MICROSOFT_CALLBACK_URL,
      scope: ["user.read"],
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
          proveedor_oauth: "microsoft",
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
  )
);
