import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
    ],

    // ── Build output ────────────────────────────────────────────────────────
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',   // source maps in staging/dev only
      // Warn if any chunk exceeds 600kB
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          // Split vendor chunks for better caching on Vercel CDN
          manualChunks: {
            react:   ['react', 'react-dom'],
            router:  ['react-router-dom'],
            chartjs: ['chart.js', 'react-chartjs-2'],
          },
          // Consistent asset file naming for CDN cache fingerprinting
          assetFileNames: (assetInfo) => {
            const ext = assetInfo.name?.split('.').pop()
            if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'].includes(ext || '')) {
              return 'assets/images/[name]-[hash][extname]'
            }
            if (['woff', 'woff2', 'ttf', 'eot'].includes(ext || '')) {
              return 'assets/fonts/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
    },

    // ── Dev server proxy → Express backend ─────────────────────────────────
    // Only active locally; Vercel routes to Render via VITE_API_URL in prod.
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL ?? 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },

    // ── Path aliases ────────────────────────────────────────────────────────
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }
})
