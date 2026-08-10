import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      // Without this, Vue warns about `<polytheme-picker>` being an unknown
      // component instead of leaving it to the custom element registry.
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('polytheme-'),
        },
      },
    }),
  ],
});
