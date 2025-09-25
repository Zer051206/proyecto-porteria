//server/server.js
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express from "express";
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

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

const app = express();

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["set-cookie"],
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 solicitudes por ventana
  message:
    "Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.",
});

// MIDDLEWARE PARA PARSEAR LA PETICIÓN (cuerpo y cookies)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(csrfMiddleware);

app.use(helmet());

app.set("trust proxy", true);

app.disable("x-powered-by");

// Conecta el enrutador de autenticación a la ruta /auth.
app.use("/auth", authRoutes);

// Conecta el enrutador de visitas a la ruta /visitas.
app.use("/visitas", apiLimiter, authMiddleware, visitRoutes);

// Conecta el enrutador de la API a la ruta /api.
app.use("/api", apiLimiter, authMiddleware, apiRoutes);

// Conecta el enrutador de paquetes a la ruta /paquetes.
app.use("/paquetes", apiLimiter, authMiddleware, packageRoutes);

app.use("/historial", apiLimiter, authMiddleware, apiRoutes);

const PORT = process.env.PORT || 3000;

app.use(errorHandler);

// Inicia el servidor directamente.
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
