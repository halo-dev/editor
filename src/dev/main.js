import Vue from 'vue'
import App from './App.vue'

import haloEditor from '../index.js'

Vue.use(haloEditor)

new Vue({
  el: '#app',
  render: h => h(App)
})
