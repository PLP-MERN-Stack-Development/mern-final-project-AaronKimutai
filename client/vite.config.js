import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({

  plugins: [react(), tailwindcss()],
  

  test: {
    environment: 'jsdom',
    include: ['src/tests/*.{jsx,js}'], 
    setupFiles: ['./vitest.setup.js'], 
  },
  
  
  optimizeDeps: {
    include: ['@testing-library/jest-dom', '@testing-library/react']
  }
});
