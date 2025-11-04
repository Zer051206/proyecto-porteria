/**
 * @file SignatureController.js
 * @module Controllers/Signatures
 * @description Controlador para manejar la lógica de subida de firmas en formato Base64.
 * Recibe el Base64 y un nombre de carpeta opcional (folder) para organizar los archivos
 * por entidad (e.g., 'paquetes', 'visitas', 'radicados').
 * Refactorizado para utilizar la sintaxis de Módulos ES6 (import/export).
 * @requires fs/promises - Para manejo asíncrono de archivos (opcional, pero buena práctica).
 * @requires path
 * @requires crypto
 * @requires url - Para obtener __dirname en ES Modules.
 */
import fs from "fs"; // Usamos la API síncrona por simplicidad en este controlador
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

// --- CONFIGURACIÓN DE RUTAS PARA ES MODULES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta base donde se guardarán los archivos de firma (debe ser accesible públicamente)
const SIGNATURES_DIR_BASE = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "signatures"
);
// URL base que se devolverá al frontend
const SIGNATURES_URL_PATH_BASE = "/signatures";

/**
 * @function uploadSignature
 * @description Recibe una imagen Base64 y opcionalmente un nombre de carpeta, la decodifica,
 * la guarda en el sistema de archivos dentro de la subcarpeta correspondiente y devuelve la ruta URL relativa.
 * @param {object} req - Objeto de solicitud de Express. Se espera { image_data: "data:image/png;base64,...", folder: "paquetes" }
 * @param {object} res - Objeto de respuesta de Express.
 */
export const uploadSignature = (req, res) => {
  try {
    // Se espera el Base64 y el nombre de la subcarpeta
    const { image_data, folder } = req.body;

    if (!image_data) {
      return res.status(400).json({
        message: "No se proporcionaron datos de imagen (image_data).",
      });
    }

    // Determinar la subcarpeta (usar 'paquetes' como default si no se especifica o validar la entrada)
    // Sanitizar el folder para evitar Path Traversal
    const safeFolder = folder ? path.basename(folder) : "paquetes";

    const FULL_SIGNATURES_DIR = path.join(SIGNATURES_DIR_BASE, safeFolder);
    const FULL_SIGNATURES_URL_PATH = `${SIGNATURES_URL_PATH_BASE}/${safeFolder}`;

    // 1. Validar y limpiar el Base64 (eliminar el prefijo 'data:image/png;base64,')
    const matches = image_data.match(/^data:(.+?);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return res
        .status(400)
        .json({ message: "Formato Base64 de imagen no válido." });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split("/")[1] || "png";

    if (extension !== "png") {
      // Es buena práctica forzar o validar que sea PNG ya que SigPad lo genera así
      return res
        .status(400)
        .json({ message: "Solo se acepta el formato PNG." });
    }

    // 2. Generar un nombre de archivo único
    const uniqueFilename = `${crypto.randomUUID()}.${extension}`;
    const filePath = path.join(FULL_SIGNATURES_DIR, uniqueFilename);
    // La ruta que se devolverá al frontend incluye la subcarpeta
    const relativeUrlPath = `${FULL_SIGNATURES_URL_PATH}/${uniqueFilename}`;

    // 3. Decodificar Base64 y guardar el archivo
    const buffer = Buffer.from(base64Data, "base64");

    // Comprobar si la carpeta (incluyendo la subcarpeta) existe. Si no existe, crearla recursivamente.
    if (!fs.existsSync(FULL_SIGNATURES_DIR)) {
      // Usamos mkdirSync ya que esta función no es asíncrona y no bloqueará el event loop significativamente
      // si se llama raramente o si el directorio ya existe.
      fs.mkdirSync(FULL_SIGNATURES_DIR, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    // 4. Devolver la URL relativa al frontend
    return res.status(200).json({
      message: "Firma guardada con éxito",
      path: relativeUrlPath, // Ejemplo: /signatures/paquetes/d1234f-a97228-4a25-bf4f-89b309b29b84.png
    });
  } catch (error) {
    console.error("Error al guardar la firma:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al procesar la firma." });
  }
};
