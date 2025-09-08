import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import passport  from 'passport';
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import visitRoutes from "./routes/visitRoutes.js"

dotenv.config();

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

/**
 * @function - // * Express middleware for enabling CORS.
 * @description - // * This middleware allows requests from the frontend to be processed by the server, preventing cross-origin errors.
 */
app.use(cors());

/**
 * @function - // * Express middleware for disabling the 'x-powered-by' header.
 * @description - // * This middleware removes the 'x-powered-by' header for security reasons.
 */
app.disable('x-powered-by');

// * Conecta el enrutador de autenticación a la ruta /auth.
app.use('/auth', authRoutes);

// * Conecta el enrutador de visitas ala ruta /visitas.
app.use('/visitas', visitRoutes)

app.use('api', apiRoutes);

const PORT = process.env.PORT || 3000;

// * Inicia el servidor directamente.
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});