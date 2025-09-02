import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';
import tailwindcssVite from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcssVite()
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});