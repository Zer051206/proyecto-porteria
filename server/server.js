// app.js o server.js
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

const app = express();

// MIDDLEWARE PARA PARSEAR LA PETICIÓN (cuerpo y cookies)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // URLs del frontend
  credentials: true, // Permite cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

app.set('trust proxy', true);

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