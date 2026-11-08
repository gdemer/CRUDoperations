import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The proxy forwards any request starting with /api to the Express server,
// so React can call fetch('/api/products') without worrying about ports or CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3000' },
  },
});
