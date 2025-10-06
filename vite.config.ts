import { defineConfig } from 'vite'

export default defineConfig({
    base: './',
    build: {
        target: 'es2015',
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: undefined
            }
        }
    },
    server: {
        host: true,
        port: 3000
    }
})
