import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    // ── Build output ────────────────────────────────────────────────────────
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',   // source maps in staging/dev only
      rolldownOptions: {
        output: {
          // Split vendor chunks for better caching on Vercel CDN
          codeSplitting: {
            groups: [
              { name: 'react',   test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,   priority: 4 },
              { name: 'router',  test: /[\\/]node_modules[\\/]react-router/,              priority: 3 },
              { name: 'chartjs', test: /[\\/]node_modules[\\/](chart\.js|react-chartjs)/, priority: 2 },
              { name: 'sentry',  test: /[\\/]node_modules[\\/]@sentry/,                   priority: 1 },
            ],
          },
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
