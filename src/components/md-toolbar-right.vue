<template>
  <div class="v-right-item">
    <slot name="right-toolbar-before" />
    <button
      type="button"
      v-if="toolbars.navigation"
      @click="$clicks('navigation')"
      v-show="!s_navigation"
      class="op-icon fa fa-halo-bars"
      aria-hidden="true"
      :title="`开启标题导航 (F8)`"
    ></button>
    <button
      type="button"
      v-if="toolbars.navigation"
      @click="$clicks('navigation')"
      v-show="s_navigation"
      class="op-icon fa fa-halo-bars selected"
      aria-hidden="true"
      :title="`关闭标题导航 (F8)`"
    ></button>
    <button
      type="button"
      v-if="toolbars.preview"
      @click="$clicks('preview')"
      v-show="s_preview_switch"
      class="op-icon fa fa-halo-eye-slash selected"
      aria-hidden="true"
      :title="`编辑 (F9)`"
    ></button>
    <button
      type="button"
      v-if="toolbars.preview"
      @click="$clicks('preview')"
      v-show="!s_preview_switch"
      class="op-icon fa fa-halo-eye"
      aria-hidden="true"
      :title="`预览 (F9)`"
    ></button>
    <button
      type="button"
      v-if="toolbars.fullscreen"
      @click="$clicks('fullscreen')"
      v-show="!s_fullScreen"
      class="op-icon fa fa-halo-arrows-alt"
      :title="`全屏编辑 (F10)`"
      aria-hidden="true"
    ></button>
    <button
      type="button"
      v-if="toolbars.fullscreen"
      @click="$clicks('fullscreen')"
      v-show="s_fullScreen"
      class="op-icon fa fa-halo-compress selected"
      :title="`退出全屏 (F10)`"
      aria-hidden="true"
    ></button>
    <button
      type="button"
      v-if="toolbars.readmodel"
      @click="$clicks('read')"
      class="op-icon fa fa-halo-window-maximize"
      aria-hidden="true"
      :title="`沉浸式阅读 (F11)`"
    ></button>
    <button
      type="button"
      v-if="toolbars.subfield"
      @click="$clicks('subfield')"
      class="op-icon fa fa-halo-columns"
      aria-hidden="true"
      :class="{'selected': s_subfield}"
      :title="`${s_subfield ? '单栏' : '双栏'} (F12)`"
    ></button>
    <span
      v-if=" toolbars.help && toolbars.htmlcode && toolbars.readmodel && toolbars.fullscreen && toolbars.subfield && toolbars.navigation"
      class="op-icon-divider"
    ></span>
    <button
      type="button"
      v-if="toolbars.htmlcode"
      @click="$clicks('html')"
      v-show="!s_html_code"
      class="op-icon fa fa-halo-code"
      title="查看 HTML 文本"
      aria-hidden="true"
    ></button>
    <button
      type="button"
      v-if="toolbars.htmlcode"
      @click="$clicks('html')"
      v-show="s_html_code"
      class="op-icon fa fa-halo-code selected"
      title="返回 Markdown 文本"
      aria-hidden="true"
    ></button>
    <button
      type="button"
      v-if="toolbars.help"
      @click="$clicks('help')"
      class="op-icon fa fa-halo-question-circle"
      style="font-size: 17px;padding: 5px 6px 5px 3px"
      title="Markdown 语法帮助"
      aria-hidden="true"
    ></button>
    <slot name="right-toolbar-after" />
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: "s-md-toolbar-right",
  props: {
    // 工具栏
    s_subfield: {
      type: Boolean,
      required: true
    },
    toolbars: { type: Object, required: true },
    s_preview_switch: { type: Boolean, required: true },
    s_fullScreen: { type: Boolean, required: true },
    s_html_code: { type: Boolean, required: true },
    s_navigation: { type: Boolean, required: true }
  },
  methods: {
    // 工具栏功能图标click-----------------
    $clicks(_type) {
      // 让父节点来绑定事件并
      this.$emit("toolbar_right_click", _type);
    }
  }
};
</script>
