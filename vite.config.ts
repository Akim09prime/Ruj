
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    base: './', 
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env.RESEND_API_KEY': JSON.stringify(env.RESEND_API_KEY || ''),
      'process.env.EMAIL_TO': JSON.stringify(env.EMAIL_TO || ''),
      'process.env.EMAIL_FROM': JSON.stringify(env.EMAIL_FROM || ''),
    },
    build: {
      outDir: 'dist',
      target: 'esnext',
    },
  };
});
