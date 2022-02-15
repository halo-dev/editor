import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    createVuePlugin(),
    Components({
      resolvers: [IconsResolver()]
    }),
    Icons({
      autoInstall: true
    })
  ]
})
