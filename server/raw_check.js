/**
 * @file test_raw_zadig.js
 * @description Prueba de lectura directa tras cambio de driver a WinUSB/libusb.
 */
import HID from "node-hid";

const VID = 65535; // 0xFFFF
const PID = 53;    // 0x0035

try {
    // Intentamos abrir la interfaz MI_01 que ahora tiene el nuevo driver
    const devices = HID.devices().filter(d => d.vendorId === VID && d.productId === PID);
    
    // Si Zadig funcionó, este path debería ser accesible
    const device = new HID.HID(devices[1]?.path || devices[0].path);

    console.log("---------------------------------------------------");
    console.log("🚀 ACCESO DIRECTO CONCEDIDO");
    console.log("Pasa la ficha por el lector...");
    console.log("---------------------------------------------------");

    device.on("data", (data) => {
        console.log("✅ ¡DATOS CAPTURADOS!");
        console.log("Buffer (Decimal):", data);
        console.log("Buffer (Hex):", data.toString('hex'));
    });

    device.on("error", (err) => {
        console.error("❌ Error de comunicación:", err.message);
    });

} catch (e) {
    console.error("❌ Error al abrir el dispositivo:", e.message);
    console.log("\nTIP: Si dice 'cannot open', intenta ejecutar la terminal como Administrador.");
}