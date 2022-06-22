<template>
  <div class="v-right-item">
    <button
      v-if="toolbars.navigation"
      v-show="!s_navigation"
      :title="`开启标题导航 (F8)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('navigation')"
    >
      <i-fa-bars />
    </button>
    <button
      v-if="toolbars.navigation"
      v-show="s_navigation"
      :title="`关闭标题导航 (F8)`"
      aria-hidden="true"
      class="op-icon selected"
      type="button"
      @click="$clicks('navigation')"
    >
      <i-fa-bars />
    </button>
    <button
      v-if="toolbars.preview"
      v-show="s_preview_switch"
      :title="`关闭预览 (F9)`"
      aria-hidden="true"
      class="op-icon selected"
      type="button"
      @click="$clicks('preview')"
    >
      <i-fa-eye-slash />
    </button>
    <button
      v-if="toolbars.preview"
      v-show="!s_preview_switch"
      :title="`开启预览 (F9)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('preview')"
    >
      <i-fa-eye />
    </button>
    <button
      v-if="toolbars.fullscreen"
      v-show="!s_fullScreen"
      :title="`全屏编辑 (F10)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('fullscreen')"
    >
      <i-fa-arrows-alt />
    </button>
    <button
      v-if="toolbars.fullscreen"
      v-show="s_fullScreen"
      :title="`退出全屏 (F10)`"
      aria-hidden="true"
      class="op-icon selected"
      type="button"
      @click="$clicks('fullscreen')"
    >
      <i-fa-compress />
    </button>
    <button
      v-if="toolbars.readmodel"
      :title="`沉浸式阅读 (F11)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('read')"
    >
      <i-fa-window-maximize />
    </button>
    <button
      v-if="toolbars.subfield"
      :class="{ selected: s_subfield }"
      :title="`${s_subfield ? '单栏' : '双栏'} (F12)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('subfield')"
    >
      <i-fa-columns />
    </button>
    <span
      v-if="toolbars.htmlcode && toolbars.readmodel && toolbars.fullscreen && toolbars.subfield && toolbars.navigation"
      class="op-icon-divider"
    ></span>
    <button
      v-if="toolbars.htmlcode"
      v-show="!s_html_code"
      aria-hidden="true"
      class="op-icon"
      title="查看 HTML 文本"
      type="button"
      @click="$clicks('html')"
    >
      <i-fa-code />
    </button>
    <button
      v-if="toolbars.htmlcode"
      v-show="s_html_code"
      aria-hidden="true"
      class="op-icon selected"
      title="返回 Markdown 文本"
      type="button"
      @click="$clicks('html')"
    >
      <i-fa-code />
    </button>
  </div>
</template>
<script>
export default {
  name: 's-md-toolbar-right',
  props: {
    // 工具栏
    s_subfield: {
      type: Boolean,
      required: true
    },
    toolbars: {
      type: Object,
      required: true
    },
    s_preview_switch: { type: Boolean, required: true },
    s_fullScreen: { type: Boolean, required: true },
    s_html_code: { type: Boolean, required: true },
    s_navigation: { type: Boolean, required: true }
  },
  methods: {
    // 工具栏功能图标click-----------------
    $clicks(_type) {
      // 让父节点来绑定事件并
      this.$emit('toolbar_right_click', _type)
    }
  }
}
</script>
