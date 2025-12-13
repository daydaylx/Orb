import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false, // Don't open automatically in CI/sandbox
      gzipSize: true,
      brotliSize: true,
      filename: 'stats.html',
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'three-postprocessing': [
            'three/examples/jsm/postprocessing/EffectComposer',
            'three/examples/jsm/postprocessing/RenderPass',
            'three/examples/jsm/postprocessing/UnrealBloomPass',
            'three/examples/jsm/postprocessing/ShaderPass',
            'three/examples/jsm/postprocessing/OutputPass',
            'three/examples/jsm/postprocessing/BokehPass',
            'three/examples/jsm/loaders/RGBELoader',
          ],
          'react-vendor': ['react', 'react-dom'],
          'state': ['zustand', 'zundo'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    } as any, // Temporary cast to fix TS error if types are mismatching
  },
});
