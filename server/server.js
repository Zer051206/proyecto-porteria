import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import express from 'express';
import cors from 'cors';
import passport  from 'passport';
import authRoutes from './src/routes/authRoutes.js';
import apiRoutes from './src/routes/apiRoutes.js';
import visitRoutes from "./src/routes/visitRoutes.js";
import packageRoutes from './src/routes/packageRoutes.js';
import cookieParser from 'cookie-parser';
import authMiddleware from './src/middlewares/authMiddleware.js';

/**
 * @file - // * This file is the entry point for the backend.
 * @author M.M
 */

const app = express();

/**
 * @function - // * Express middleware for parsing JSON bodies.
 * @description - // * This middleware allows the server to understand JSON data in incoming requests.
 */
app.use(express.json());

app.use(cookieParser());

/**
 * @function - // * Express middleware for enabling CORS.
 * @description - // * This middleware allows requests from the frontend to be processed by the server, preventing cross-origin errors.
 */
app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true
}));

/**
 * @function - // * Express middleware for disabling the 'x-powered-by' header.
 * @description - // * This middleware removes the 'x-powered-by' header for security reasons.
 */
app.disable('x-powered-by');

// * Conecta el enrutador de autenticación a la ruta /auth.
app.use('/auth', authRoutes);

// * Conecta el enrutador de visitas ala ruta /visitas.
app.use('/visitas', authMiddleware, visitRoutes)

// * Conecta el enrutador de la API a la ruta /api.
app.use('/api', authMiddleware, apiRoutes);

// * Conecta el enrutador de paquetes a la ruta /paquetes.
app.use('/paquetes', authMiddleware, packageRoutes)

app.use('/historial', authMiddleware, apiRoutes);

const PORT = process.env.PORT || 3000;

// * Inicia el servidor directamente.
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});