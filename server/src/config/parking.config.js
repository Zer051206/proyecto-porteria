// Límites de capacidad
export const CAPACITY_LIMITS = {
  Carro: 7,
  Moto: 50,
  Bicicleta: 12,
  Otros: 10,
};

export const rfidConfig = {
  vendorId: 65535, 
  productId: 53,
  endpoint: 'http://localhost:3000/api/parqueadero/scan' 
};
