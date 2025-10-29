/**
 * @file apiKeyAuth.js
 * @module Middlewares
 * @description Middleware para validar una API Key enviada en las cabeceras.
 * Específicamente diseñado para autenticar clientes automatizados como el lector NFC.
 * @requires ../config/logger.js
 * @requires ../utils/customErrors.js
 */
import logger from "../config/logger.js";
import { ForbiddenError, MissingApiKeyError } from "../utils/customErrors.js";

const VALID_API_KEYS = [process.env.SCANNER_API_KEY].filter(Boolean);

if (VALID_API_KEYS.length === 0) {
  logger.warn(
    "¡ADVERTENCIA! No se ha configurado ninguna SCANNER_API_KEY en las variables de entorno. El middleware apiKeyAuth no funcionará correctamente."
  );
}

/**
 * @function apiKeyAuth
 * @description Middleware de Express para validar la API Key.
 * Busca la clave en la cabecera 'X-API-Key' o 'Authorization: ApiKey ...'.
 * Si es válida, permite continuar. Si no, devuelve un error 401 o 403.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware o controlador.
 */
const apiKeyAuth = (req, res, next) => {
  let providedApiKey = null;

  // 1. Buscar en cabecera 'X-API-Key' (preferida)
  if (req.headers["x-api-key"]) {
    providedApiKey = req.headers["x-api-key"];
  }
  // 2. Si no, buscar en 'Authorization' con el esquema 'ApiKey'
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("ApiKey ")
  ) {
    providedApiKey = req.headers.authorization.split(" ")[1];
  }

  // 3. Verificar si se proporcionó una clave
  if (!providedApiKey) {
    logger.warn(
      { ip: req.ip, path: req.originalUrl },
      "Intento de acceso a ruta protegida por API Key sin proporcionar clave."
    );
    // Usa MissingApiKeyError o crea uno específico como MissingApiKeyError
    return next(
      new MissingApiKeyError(
        "Falta la API Key en la cabecera X-API-Key o Authorization: ApiKey."
      )
    ); // 401
  }

  // 4. Verificar si la clave proporcionada es una de las válidas
  if (VALID_API_KEYS.includes(providedApiKey)) {
    logger.debug(
      { ip: req.ip, path: req.originalUrl },
      "Acceso concedido mediante API Key válida."
    );
    next(); // Pasa al siguiente middleware/controlador
  } else {
    // Clave inválida
    logger.warn(
      { ip: req.ip, path: req.originalUrl, keyProvided: providedApiKey },
      "Intento de acceso con API Key inválida."
    );
    // Usa ForbiddenError ya que se proporcionó una clave, pero no es correcta
    return next(new ForbiddenError("API Key inválida."));
  }
};

export default apiKeyAuth;
