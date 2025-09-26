/**
 * @file server.js
 * @module AppServer
 * @description Punto de entrada principal para el backend. Configura e inicia el servidor Express,
 * aplicando middlewares de seguridad, manejo de CORS, límites de peticiones (rate limiting)
 * y enrutamiento para la API, autenticación, visitas y paquetes.
 */
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express from "express";
import path from "path";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import authRoutes from "./src/routes/authRoutes.js";
import apiRoutes from "./src/routes/apiRoutes.js";
import visitRoutes from "./src/routes/visitRoutes.js";
import packageRoutes from "./src/routes/packageRoutes.js";
import cookieParser from "cookie-parser";
import authMiddleware from "./src/middlewares/authMiddleware.js";
import errorHandler from "./src/middlewares/errorMiddleware.js";
import csrfMiddleware, {
  csrfTokenMiddleware,
} from "./src/middlewares/csrfMiddleware.js";

/**
 * @const {Array<string>} allowedOrigins
 * @description Lista de orígenes permitidos para la configuración de CORS.
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARES ---

/**
 * Middleware de CORS
 * @description Configura la política de intercambio de recursos de origen cruzado, permitiendo
 * peticiones solo desde los orígenes seguros y configurando la manipulación de cookies.
 */
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["set-cookie"],
  })
);

/**
 * Middleware de Rate Limiting
 * @description Limita el número de peticiones por ventana de tiempo para prevenir ataques de fuerza bruta o DDoS.
 * Configuración: 100 solicitudes por 15 minutos por IP.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 solicitudes por ventana
  message:
    "Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.",
});

// Middleware para parsear el cuerpo de la petición (JSON y URL-encoded) y cookies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware CSRF: Genera y verifica tokens CSRF para peticiones seguras.
app.use(csrfMiddleware);

// Middleware Helmet: Colección de middlewares de seguridad para HTTP Headers.
app.use(helmet());

// Confía en el primer proxy para obtener la IP real (necesario para rate limiting en entornos de producción).
app.set("trust proxy", true);

// Deshabilita el header X-Powered-By por seguridad.
app.disable("x-powered-by");

/**
 * Servidor de archivos estáticos para firmas digitales.
 * @description Expone la carpeta donde se guardan las firmas de los visitantes.
 */
app.use(
  "/signatures",
  express.static(path.join(process.cwd(), "public", "signatures"))
);

// --- ENRUTAMIENTO DE LA API ---

// Ruta de Autenticación (incluye login, logout, refresh, etc.)
app.use("/auth", authRoutes);

// Rutas protegidas con Rate Limiting y Auth Middleware.
app.use("/visitas", apiLimiter, authMiddleware, visitRoutes);
app.use("/api", apiLimiter, authMiddleware, apiRoutes);
app.use("/paquetes", apiLimiter, authMiddleware, packageRoutes);
app.use("/historial", apiLimiter, authMiddleware, apiRoutes);

const PORT = process.env.PORT || 3000;

// Middleware de manejo de errores global (debe ser el último en definirse).
app.use(errorHandler);

// Inicia el servidor.
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
