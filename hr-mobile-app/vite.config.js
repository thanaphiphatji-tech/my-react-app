import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/',   // 👈 สำคัญมากสำหรับ GitHub Pages

  server: {
    port: 5173,
    proxy: {
      '/gas': {
        target: 'https://script.google.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(
            /^\/gas/,
            '/macros/s/AKfycbyEX2_dopaayoa10XBwG1zqxI0_GOsWeLTNIML8O5TqlLPNHmBfuKC0GfSHEOzPylQ82g/exec'
          )
      }
    }
  }
})
