/**
 * Created by zhy on 2017/4/1.
 */
'use strict';

/**
 * haloEditor
 * based on mavonEditor(https://github.com/hinesboy/mavonEditor)
 * @author hinesboy
 */
const haloEditor = require('./halo-editor.vue');
const VueHaloEditor = {
    markdownIt: haloEditor.mixins[0].data().markdownIt,
    haloEditor: haloEditor,
    LeftToolbar: require('./components/md-toolbar-left'),
    RightToolbar: require('./components/md-toolbar-right'),
    install: function(Vue) {
        Vue.component('halo-editor', haloEditor);
    }
};

module.exports = VueHaloEditor;
