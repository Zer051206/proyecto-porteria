/**
 * @const {Array<object>} vehicleConfig
 * @description Configuración para el DetailModal, define qué mostrar para un vehículo.
 */
export const vehicleConfig = [
  { label: "Placa", key: "placa", conditional: true },
  { label: "Tipo", key: "tipo_vehiculo" },
  { label: "Dueño", key: "nombre_dueno" },
  { label: "Identificación", key: "identificacion_dueno" },
  { label: "Código Sensor", key: "codigo_sensor", conditional: true },
  { label: "Lugar Asignado", key: "lugar_asignado_default", conditional: true },
  { label: "Modelo/Descripción", key: "modelo_descripcion", conditional: true },
  // (No mostramos 'esta_dentro' o 'activo' porque ya se ven en la tabla)
];

/**
 * @const {Array<object>} visitConfig
 * @description Configuración para el DetailModal al mostrar una 'visita'.
 * Nota: Los keys anidados como 'IdentificationType.descripcion' son manejados
 * por la función 'getNestedValue' dentro del componente DetailModal.
 */
export const visitConfig = [
  { label: "Nombre Visitante", key: "nombre_visitante" },
  { label: "Tipo ID", key: "IdentificationType.descripcion" },
  { label: "Identificación", key: "identificacion" },
  { label: "Empresa", key: "empresa", conditional: true },
  { label: "Destinatario", key: "nombre_destinatario" },
  { label: "Área", key: "Area.nombre_area" },
  { label: "Motivo", key: "motivo" },
  { label: "Fecha Entrada", key: "fecha_entrada", format: "date" },
  { label: "Fecha Salida", key: "fecha_salida", format: "date" },
  { label: "Observaciones", key: "observaciones", conditional: true },
];

/**
 * @const {Array<object>} packageConfig
 * @description Configuración para el DetailModal al mostrar un 'paquete'.
 * Incluye campos estándar y los nuevos campos para radicados/firmas.
 */
export const packageConfig = [
  { label: "Guía", key: "guia", conditional: true },
  {
    label: "Referencia Radicado",
    key: "referencia_radicado",
    conditional: true,
  },
  { label: "Tipo Paquete", key: "PackageType.descripcion" },
  { label: "Operación", key: "tipo_operacion" },
  { label: "Remitente", key: "nombre_remitente", conditional: true },
  { label: "Destinatario", key: "nombre_destinatario", conditional: true },
  { label: "Área", key: "Area.nombre_area" },
  { label: "Transportadora", key: "empresa_transporte", conditional: true },
  { label: "Mensajero", key: "mensajero_nombre", conditional: true },
  { label: "Destino (Salida)", key: "destino_salida", conditional: true },
  { label: "Recibido por", key: "nombre_recibe_documento", conditional: true },
  { label: "Fecha Recibido", key: "fecha_recibido", format: "date" },
  { label: "Fecha Enviado", key: "fecha_envio", format: "date" },
  { label: "Observaciones", key: "observaciones", conditional: true },
];
