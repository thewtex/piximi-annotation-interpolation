import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
  },
  optimizeDeps: {
    exclude: ["@itk-wasm/htj2k", "itk-wasm", "@itk-viewer/io", "p-queue"],
  },
  plugins: [
    // collect lazy loaded JavaScript and Wasm bundles in public directory
    viteStaticCopy({
      targets: [
        {
          src: "./node_modules/itk-wasm/dist/pipeline/web-workers/bundles/itk-wasm-pipeline.min.worker.js",
          dest: "itk/web-workers",
        },
        {
          src: "node_modules/.pnpm/@itk-viewer+blosc-zarr@0.2.3/node_modules/@itk-viewer/blosc-zarr/emscripten-build/*",
          dest: "itk/pipelines",
        },
        {
          src: "./node_modules/@shoelace-style/shoelace/dist/assets",
          dest: "dist/shoelace",
        },
        {
          src: './node_modules/.pnpm/@itk-wasm+image-io@1.3.0/node_modules/@itk-wasm/image-io/dist/pipelines/*',
          dest: 'itk/pipelines',
        },
        {
          src: './node_modules/.pnpm/@itk-wasm+morphological-contour-interpolation@1.1.0/node_modules/@itk-wasm/morphological-contour-interpolation/dist/pipelines/*',
          dest: 'itk/pipelines',
        }
      ],
    }),
  ],
});
