import HID from "node-hid";

console.log("--- LISTA DE DISPOSITIVOS ---");
HID.devices().forEach(d => {
    console.log(`ID: ${d.vendorId}:${d.productId} | Name: ${d.product} | Path: ${d.path.substring(0, 50)}...`);
});