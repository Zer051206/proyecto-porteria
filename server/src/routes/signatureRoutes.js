/**
 * @file signatureRoutes.js
 * @module Routes/Signatures
 * @description Define las rutas de la API relacionadas con la gestión y subida de firmas
 * electrónicas en formato Base64.
 * @exports router
 * @requires express
 * @requires ../controllers/signatureController.js - Controlador con la lógica de negocio
 * para decodificar, guardar y devolver la URL de la firma.
 */
import { Router } from "express";
import * as signatureController from "../controllers/signatureController.js";

const router = Router();

/**
 * @route POST /api/signatures/upload
 * @description Endpoint para recibir una imagen de firma en formato Base64,
 * guardarla en el sistema de archivos del servidor (con soporte para subcarpetas),
 * y retornar su ruta URL relativa.
 * * El cuerpo de la solicitud (req.body) espera:
 * - {string} image_data: La cadena Base64 de la imagen, incluyendo el prefijo (e.g., "data:image/png;base64,...").
 * - {string} folder: (Opcional, pero recomendado) El nombre de la subcarpeta donde se almacenará la firma (e.g., "paquetes", "radicados").
 * @middleware signatureController.uploadSignature - Lógica de subida y guardado.
 */
router.post("/upload", signatureController.uploadSignature);

export default router;
