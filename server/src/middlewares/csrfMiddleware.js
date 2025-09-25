import { InvalidTokenError } from "../utils/customErrors.js";
import crypto from "crypto";

const CSRF_TOKEN_HEADER = "x-csrf-token";
const CSRF_TOKEN_COOKIE = "csrf-token";

/**
 * Genera un token CSRF seguro.
 * @returns {string} El token CSRF en formato hexadecimal.
 */
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Middleware para la protección CSRF.
 * Implementa el patrón "Double Submit Cookie".
 */
const csrfMiddleware = (req, res, next) => {
  // Ignora métodos seguros que no cambian el estado del servidor
  if (
    req.method === "GET" ||
    req.method === "HEAD" ||
    req.method === "OPTIONS"
  ) {
    // Para cualquier petición GET, se genera un nuevo token si no existe.
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

  // Para métodos que modifican el estado (POST, PUT, DELETE, PATCH)
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
 * Middleware para exponer el token CSRF al frontend.
 * Esta ruta es llamada por el frontend para inicializar la comunicación.
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
