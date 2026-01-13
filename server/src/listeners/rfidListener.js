/**
 * @file rfidListener.js
 * @module Listeners/RFID
 * @description Captura datos de hardware RFID mediante la escucha global de eventos de teclado.
 * Ideal para dispositivos con restricciones de lectura HID directa en Windows.
 */

import { GlobalKeyboardListener } from "node-global-key-listener";
import axios from "axios";
import dotenv from "dotenv";
import { rfidConfig } from "../config/parking.config.js";

dotenv.config({ path: "../../.env" });

const keyboard = new GlobalKeyboardListener();
let codeBuffer = "";

console.log("---------------------------------------------------");
console.log("[RFID] SERVICIO INICIADO (Modo Global)");
console.log("[RFID] Esperando lectura de ficha...");
console.log("---------------------------------------------------");

/**
 * Escucha global de pulsaciones. 
 * El lector RFID envía los números y finaliza con la tecla 'RETURN'.
 */
keyboard.addListener(function (e, down) {
  if (e.state === "DOWN") {
    // Captura solo caracteres numéricos
    if (/[0-9]/.test(e.name)) {
      codeBuffer += e.name;
    } 
    // Detecta el final de la lectura (Enter/Return)
    else if (e.name === "RETURN") {
      if (codeBuffer.length > 0) {
        sendScanToApi(codeBuffer);
        codeBuffer = ""; 
      }
    }
  }
});

/**
 * @async
 * @function sendScanToApi
 * @description Reporta el código al backend y maneja la respuesta del servidor.
 * @param {string} codigo_sensor - Código capturado por el listener.
 */
async function sendScanToApi(codigo_sensor) {
  try {
    console.log(`[RFID] Procesando ficha: ${codigo_sensor}`);
    const response = await axios.post(
      rfidConfig.endpoint,
      { codigo_sensor },
      {
        headers: {
          "X-API-Key": process.env.SCANNER_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`[API] ${response.data.message}`);
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error(`[API] Error: ${msg}`);
  }
}

// Prevenir que el proceso se cierre inmediatamente
process.stdin.resume();