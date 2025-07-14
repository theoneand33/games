// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({});
    vite: {
        build: {
      // Run right after Astro finishes
          rollupOptions: {
            output: {
            plugins: [{
                name: "make-search-index",
                generateBundle() {
              // import() runs it in Node context
                import("src/scripts/make-search-index.js");
            }
          }]
        }
      }
    }
  }