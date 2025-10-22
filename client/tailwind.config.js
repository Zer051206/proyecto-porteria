/** @type {import('tailwindcss').Config} */
// Nota: 'import colors' ya no es necesario, ya que definimos todos los colores manualmente.

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // Escanea todos los archivos JS y JSX en la carpeta src
  ],
  theme: {
    extend: {
      // Definimos nuestra nueva paleta de colores semántica con códigos HEX
      colors: {
        // Color principal: Amarillo "Limón" (basado en Tailwind Yellow)
        primary: {
          light: "#fef9c3", // yellow-100
          DEFAULT: "#facc15", // yellow-400
          hover: "#eab308", // yellow-500
          text: "#854d0e", // yellow-800
        },
        // Color secundario: Azul Profesional (basado en Tailwind Blue)
        secondary: {
          light: "#dbeafe", // blue-100
          DEFAULT: "#2563eb", // blue-600
          hover: "#1d4ed8", // blue-700
          text: "#1e3a8a", // blue-800
        },
        // Color terciario: Gris/Pizarra (para acciones neutrales, iconos, cancelar)
        tertiary: {
          light: "#f1f5f9", // slate-100
          DEFAULT: "#1e293b", // slate-800
          hover: "#0f172a", // slate-900
          text: "#ffffff", // white
        },
        // Colores de UI (basados en gris 'slate' que es más frío)
        background: "#f1f5f9", // slate-100
        surface: "#ffffff", // white
        neutral: {
          200: "#e2e8f0", // slate-200 (para hovers de fondos claros)
          400: "#94a3b8", // slate-400 (para bordes, iconos, botones sutiles)
        },
        // Colores de Texto
        "text-main": "#1e293b", // slate-800
        "text-muted": "#64748b", // slate-500
        // Colores de Feedback
        success: "#16a34a", // green-600
        error: {
          DEFAULT: "#dc2626", // red-600
          hover: "#b91c1c", // red-700
        },
      },
      // Definimos la fuente principal de la aplicación
      fontFamily: {
        sans: ['"Inter"', "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
