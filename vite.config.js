import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/coinpoker/',
  plugins: [react()],
  esbuild: {
    // Some third-party packages ship sourcemap comments that can trigger
    // noisy "missing-source-map" warnings in stricter CI/deploy environments.
    logOverride: {
      'missing-source-map': 'silent',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'SOURCEMAP_ERROR') {
          return
        }

        warn(warning)
      },
    },
  },
})
