module.exports = {
  // Estos 'presets' permiten entender JS moderno y JSX (React)
  presets: ["@babel/preset-env", "@babel/preset-react"],
  // Este 'plugin' es esencial para entender la sintaxis 'import.meta.env' de Vite.
  plugins: ["@babel/plugin-syntax-import-meta"],
};
