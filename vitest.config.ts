import { defineConfig } from 'vitest/config'
import path from 'path'
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}) 