import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    createVuePlugin(),
    Components({
      resolvers: [IconsResolver()]
    }),
    Icons({
      autoInstall: true
    })
  ],
  build: {
    outDir: path.resolve(__dirname, 'dist/lib'),
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'HaloEditor',
      fileName: format => `halo-editor.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    },
    sourcemap: true
  }
})
