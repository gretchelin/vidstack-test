import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => {
          // vidstack elems
          const vds = ['media-poster', 'media-provider', 'media-audio-layout', 'media-video-layout'];

          const iscustom = tag.startsWith('media-') || vds.includes(tag);
          console.log('build', {tag, iscustom});

          return iscustom
        },
      },
    },
  })],
})
