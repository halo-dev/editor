/**
 * Created by zhy on 2017/4/1.
 */
'use strict'

/**
 * haloEditor
 * @author hinesboy
 */
import haloEditor from './halo-editor.vue'

const HaloEditor = {
  markdownIt: haloEditor.mixins[0].data().markdownIt,
  editor: haloEditor,
  install: function (Vue) {
    Vue.component('halo-editor', haloEditor)
  }
}

export default HaloEditor
