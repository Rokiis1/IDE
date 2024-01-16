import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  renderers: ['@astrojs/renderer-react'],
  integrations: [tailwind({
    // Example: Disable injecting a basic `base.css` import on every page.
    // Useful if you need to define and/or import your own custom `base.css`.
    applyBaseStyles: false,
    nesting: true
  }), react()],
  vite: {
    
    /* ... */
  },
});