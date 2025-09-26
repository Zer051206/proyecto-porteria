/**
 * @file csrfMiddleware.js
 * @module csrfMiddleware
 * @description Implementa la protección contra ataques Cross-Site Request Forgery (CSRF)
 * utilizando el patrón "Double Submit Cookie". Define el middleware principal de validación
 * y una función auxiliar para exponer el token al frontend.
 */

import { InvalidTokenError } from "../utils/customErrors.js";
import crypto from "crypto";

/**
 * @const {Array<string>} CSRF_EXCLUDED_PATHS
 * @description Rutas que deben ser EXCLUIDAS de la verificación CSRF. Las rutas de login
 * y registro se excluyen porque la primera solicitud no puede incluir el token.
 */
const CSRF_EXCLUDED_PATHS = ["/auth/login", "/auth/register"];

/**
 * @const {string} CSRF_TOKEN_HEADER
 * @description Nombre del encabezado HTTP donde se espera recibir el token CSRF (ej: 'x-csrf-token').
 */
const CSRF_TOKEN_HEADER = "x-csrf-token";

/**
 * @const {string} CSRF_TOKEN_COOKIE
 * @description Nombre de la cookie donde se almacena el token CSRF.
 */
const CSRF_TOKEN_COOKIE = "csrf-token";

/**
 * @function generateCsrfToken
 * @description Genera un token CSRF seguro mediante bytes aleatorios.
 * @returns {string} El token CSRF en formato hexadecimal.
 */
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * @function csrfMiddleware
 * @description Middleware principal para la protección CSRF (Double Submit Cookie).
 * Verifica que el token CSRF enviado en el encabezado HTTP coincida con el token
 * almacenado en la cookie para métodos que modifican el estado (POST, PUT, etc.).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware/ruta.
 * @returns {void} Llama a `next()` si la verificación es exitosa.
 * @throws {InvalidTokenError} Si los tokens no existen o no coinciden.
 */
const csrfMiddleware = (req, res, next) => {
  const originalUrl = req.originalUrl;
  const method = req.method;

  // 🚩 LÓGICA CORREGIDA: Excluir rutas específicas (login/register) de la verificación CSRF.
  const isExcluded =
    (method === "POST" ||
      method === "PUT" ||
      method === "PATCH" ||
      method === "DELETE") &&
    CSRF_EXCLUDED_PATHS.some((path) => originalUrl.includes(path));

  if (isExcluded) {
    // Si es una ruta excluida, se salta la verificación de tokens y se continúa.
    return next();
  }

  // Ignora métodos seguros que no cambian el estado del servidor
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    // Para cualquier petición GET, se genera un nuevo token si no existe y se envía como cookie no HTTP-only
    if (!req.cookies[CSRF_TOKEN_COOKIE]) {
      const token = generateCsrfToken();
      res.cookie(CSRF_TOKEN_COOKIE, token, {
        httpOnly: false, // Debe ser accesible por JavaScript para leerlo
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
    return next();
  }

  // Para métodos que modifican el estado (POST, PUT, DELETE, PATCH) y NO están excluidos
  try {
    const tokenFromHeader = req.headers[CSRF_TOKEN_HEADER];
    const tokenFromCookie = req.cookies[CSRF_TOKEN_COOKIE];

    if (
      !tokenFromHeader ||
      !tokenFromCookie ||
      tokenFromHeader !== tokenFromCookie
    ) {
      throw new InvalidTokenError("Token CSRF inválido.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * @function csrfTokenMiddleware
 * @description Middleware específico de ruta para generar o renovar el token CSRF
 * y enviarlo en el cuerpo de la respuesta al frontend para su uso inicial.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Envía una respuesta JSON con el nuevo token.
 */
export const csrfTokenMiddleware = (req, res, next) => {
  const token = req.cookies[CSRF_TOKEN_COOKIE] || generateCsrfToken();
  res.cookie(CSRF_TOKEN_COOKIE, token, {
    httpOnly: false, // Accesible por JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  res.status(200).json({ csrfToken: token });
};

export default csrfMiddleware;
