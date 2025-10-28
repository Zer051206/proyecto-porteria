/**
 * @file server.js
 * @module AppServer
 * @description Punto de entrada principal para el backend del sistema de portería.
 * Configura e inicia el servidor Express, aplicando middlewares, enrutamiento y
 * asegurando la conexión con la base de datos.
 * @requires ./envLoader.js - ¡Importante que sea la primera importación!
 */

// 1. Carga de Variables de Entorno
import "./envLoader.js";

// 2. Importaciones de Módulos y Frameworks
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import db from "./src/models/index.js";
import logger from "./src/config/logger.js";

// 3. Importaciones de Rutas de la Aplicación
import authRoutes from "./src/routes/authRoutes.js";
import visitRoutes from "./src/routes/visitRoutes.js";
import packageRoutes from "./src/routes/packageRoutes.js";
import apiRoutes from "./src/routes/apiRoutes.js";
import parkingRoutes from "./src/routes/parkingRoutes.js";

// 4. Importaciones de Middlewares Personalizados
import authMiddleware from "./src/middlewares/authMiddleware.js";
import errorHandler from "./src/middlewares/errorMiddleware.js";

// --- CONFIGURACIÓN INICIAL ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// --- APLICACIÓN DE MIDDLEWARES GLOBALES ---

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === "production" ? 100 : 2000,
  message:
    "Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  "/signatures",
  express.static(path.join(__dirname, "public", "signatures"))
);

// --- ENRUTAMIENTO DE LA API ---

/**
 * @section Rutas Públicas
 * @description Rutas que no requieren autenticación.
 */
app.use("/auth", authRoutes);

/**
 * @section Rutas Privadas
 * @description Todas las rutas bajo '/api' requieren un token de acceso válido.
 * Se aplica el rate limiter y el middleware de autenticación.
 */
app.use("/api", apiLimiter, authMiddleware);

// Rutas específicas para cada recurso, ya protegidas por el middleware anterior
app.use("/api/visitas", visitRoutes);
app.use("/api/paquetes", packageRoutes);
app.use("/api/parqueadero", parkingRoutes);
app.use("/api", apiRoutes); // Para rutas generales como el historial

// --- MANEJADOR DE ERRORES ---
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

/**
 * @async
 * @function startServer
 * @description Inicia la aplicación: verifica la conexión a la DB y luego arranca el servidor Express.
 */
async function startServer() {
  try {
    await db.sequelize.authenticate();
    logger.info("✅ Conexión a MariaDB establecida exitosamente.");

    app.listen(PORT, () => {
      logger.info(`🚀 Servidor Express iniciado en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.fatal(
      error,
      "❌ Error fatal al iniciar la aplicación o conectar a la base de datos."
    );
    process.exit(1);
  }
}

startServer();
