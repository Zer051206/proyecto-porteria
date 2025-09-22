/**
 * @file - Este archivo contiene funciones de utilidad para manejar la lógica de los inputs.
 * @author M.M
 */

/**
 * Función para prevenir la entrada de la letra 'e', el signo '+' y el signo '-'
 * en inputs de tipo 'number' para evitar valores no deseados.
 * @param {Event} event - El evento del teclado.
 */
export const handleKeyNumberDown = (event) => {
  // Array de teclas que no queremos permitir
  const invalidKeys = ["e", "E", "+", "-", ".", ","];

  // Si la tecla presionada está en la lista de no válidas, prevenimos la acción por defecto
  if (invalidKeys.includes(event.key)) {
    event.preventDefault();
  }
};

/**
 * Función que previene la entrada de números y símbolos no alfanuméricos en campos de texto, como nombres.
 * Permite letras (mayúsculas y minúsculas), tildes, la 'ñ', espacios y guiones.
 * @param {KeyboardEvent} e - El evento de teclado.
 */
export function handleKeyTextDown(e) {
  // Expresión regular que permite letras, la letra 'ñ', tildes, espacios y el guion.
  // Es mejor usar una lista de caracteres permitidos para evitar símbolos inesperados.
  const allowedCharacters = /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]/;

  // Verifica si la tecla no es un caracter permitido y no es una tecla de control (como backspace, delete, etc.)
  if (!allowedCharacters.test(e.key) && e.key.length === 1) {
    e.preventDefault();
  }
}

/**
 * Función que previene la entrada de caracteres no válidos en campos de dirección.
 * Permite letras, números, espacios, guiones, puntos, comas y el símbolo de número (#).
 * @param {KeyboardEvent} e - El evento de teclado.
 */
export function handleAddressKeyDown(e) {
  // Expresión regular que permite letras, números, espacios y símbolos comunes en direcciones.
  const allowedCharacters = /[a-zA-Z0-9\s.,#-]/;

  // Permite teclas de control como backspace, delete, tab, y flechas.
  const isControlKey =
    e.key === "Backspace" ||
    e.key === "Delete" ||
    e.key === "Tab" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown";

  // Si la tecla no es un caracter permitido y no es una tecla de control, previene la acción.
  if (!allowedCharacters.test(e.key) && !isControlKey) {
    e.preventDefault();
  }
}
