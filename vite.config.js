import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    Inspect(),
    createVuePlugin(),
    Components({
      resolvers: [IconsResolver()]
    }),
    Icons({
      autoInstall: true
    })
  ]
})
