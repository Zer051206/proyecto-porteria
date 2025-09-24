// Opciones para formatear la fecha y hora de manera consistente
const dateTimeOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

// Función para formatear fechas de forma segura
export const formatDate = (dateString) => {
  // Retorna "N/A" si la fecha no existe
  if (!dateString) {
    return "N/A";
  }
  const date = new Date(dateString);
  // Retorna "N/A" si la fecha no es válida (e.g., "Invalid Date")
  if (isNaN(date)) {
    return "N/A";
  }
  // Formatea la fecha usando las opciones definidas
  return date.toLocaleString("es-ES", dateTimeOptions);
};
