import HID from "node-hid";

const VID = 0xFFFF;
const PID = 0x0035;

const devices = HID.devices().filter(d => d.vendorId === VID && d.productId === PID);

console.log(`Se encontraron ${devices.length} interfaces.`);

devices.forEach((dev, index) => {
    try {
        console.log(`Intentando abrir Interfaz [${index}] - Path: ${dev.path}`);
        const device = new HID.HID(dev.path);

        device.on("data", (data) => {
            console.log(`Data desde Interfaz [${index}]:`, data);
        });

        device.on("error", (err) => {
            console.log(`Error en Interfaz [${index}]:`, err.message);
        });
        
        console.log(`✅ Interfaz [${index}] abierta y escuchando.`);
    } catch (e) {
        console.log(`❌ No se pudo abrir Interfaz [${index}]:`, e.message);
    }
});