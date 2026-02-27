
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    base: '/', 
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      '__BUILD_VERSION__': JSON.stringify(new Date().toISOString()),
    },
    build: {
      outDir: 'cpanel-deploy',
      target: 'esnext',
    },
  };
});
