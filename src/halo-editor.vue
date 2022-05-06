<template>
  <div
    :class="[{ fullscreen: s_fullScreen, shadow: boxShadow }]"
    :style="{ 'box-shadow': boxShadow ? boxShadowStyle : '' }"
    class="v-note-wrapper markdown-body"
  >
    <!--工具栏-->
    <div v-if="toolbarsFlag" :style="{ background: toolbarsBackground }" class="v-note-op">
      <v-md-toolbar-left
        ref="toolbar_left"
        :class="{ transition: transition }"
        :toolbars="toolbars"
        :transition="transition"
        @clickCommands="clickCommands"
        @insertLink="insertLink"
        @openImagePicker="openImagePicker"
      />
      <v-md-toolbar-right
        ref="toolbar_right"
        :class="{ transition: transition }"
        :s_fullScreen="s_fullScreen"
        :s_html_code="s_html_code"
        :s_navigation="s_navigation"
        :s_preview_switch="s_preview_switch"
        :s_subfield="s_subfield"
        :toolbars="toolbars"
        @toolbar_right_click="toolbar_right_click"
      />
    </div>
    <!--编辑展示区域-->
    <div class="v-note-panel">
      <!--编辑区-->
      <div
        ref="vNoteEdit"
        :class="{
          'scroll-style': scrollStyle,
          'scroll-style-border-radius': scrollStyle && !s_preview_switch && !s_html_code,
          'single-edit': !s_preview_switch && !s_html_code,
          'single-show': (!s_subfield && s_preview_switch) || (!s_subfield && s_html_code),
          transition: transition
        }"
        class="v-note-edit divarea-wrapper"
        @click="setFocus"
      >
        <div :style="{ 'background-color': editorBackground }" class="content-input-wrapper">
          <textarea ref="cmRef"></textarea>
        </div>
      </div>
      <!--展示区-->
      <div
        v-show="s_preview_switch || s_html_code"
        :class="{
          'single-show': (!s_subfield && s_preview_switch) || (!s_subfield && s_html_code)
        }"
        class="v-note-show"
      >
        <div
          v-show="!s_html_code"
          ref="vShowContent"
          :class="{
            'scroll-style': scrollStyle,
            'scroll-style-border-radius': scrollStyle
          }"
          :style="{ 'background-color': previewBackground }"
          class="v-show-content"
          v-html="d_render"
        ></div>
        <div
          v-show="s_html_code"
          :class="{
            'scroll-style': scrollStyle,
            'scroll-style-border-radius': scrollStyle
          }"
          :style="{ 'background-color': previewBackground }"
          class="v-show-content-html"
        >
          {{ d_render }}
        </div>
      </div>

      <!--标题导航-->
      <transition name="slideTop">
        <div v-show="s_navigation" :class="{ transition: transition }" class="v-note-navigation-wrapper">
          <div class="v-note-navigation-title">
            导航目录<i class="v-note-navigation-close" @click="toolbar_right_click('navigation')">
              <i-fa-times height="0.8rem" width="0.8rem" />
            </i>
          </div>
          <div ref="navigationContent" :class="{ 'scroll-style': scrollStyle }" class="v-note-navigation-content"></div>
        </div>
      </transition>
    </div>
    <!-- 预览图片 -->
    <transition name="fade">
      <div v-if="d_preview_imgsrc" class="v-note-img-wrapper" @click="d_preview_imgsrc = null">
        <img :src="d_preview_imgsrc" alt="none" />
      </div>
    </transition>
    <!--阅读模式-->
    <div ref="vReadModel" :class="{ show: s_readmodel }" class="v-note-read-model scroll-style">
      <div ref="vNoteReadContent" class="v-note-read-content" v-html="d_render"></div>
    </div>
  </div>
</template>

<script>
import { keydownListen } from './lib/core/keydown-listen.js'
import { fullscreenchange, getNavigation, ImagePreviewListener } from './lib/core/extra-function.js'
import { toolbar_right_click } from './lib/toolbar_right_click.js'
import { CONFIG } from './lib/config.js'
import markdown from './lib/mixins/markdown.js'

import md_toolbar_left from './components/md-toolbar-left.vue'
import md_toolbar_right from './components/md-toolbar-right.vue'

// libs
import times from 'lodash.times'
import flatten from 'lodash.flatten'
import last from 'lodash.last'
import debounce from 'lodash.debounce'
import 'github-markdown-css/github-markdown-light.css'
import 'katex/dist/katex.min.css'

// CodeMirror
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'

// CodeMirror Language
import 'codemirror/mode/markdown/markdown.js'

// CodeMirror Addons
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/display/fullscreen.js'
import 'codemirror/addon/display/fullscreen.css'
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/continuelist'

// mte-kernel
import { TextEditorInterface } from './lib/core/mte-kernel/mte'

const markups = {
  bold: {
    start: '**'
  },
  italic: {
    start: '*'
  },
  underline: {
    start: '++'
  },
  strikethrough: {
    start: '~~'
  },
  superscript: {
    start: '^'
  },
  subscript: {
    start: '~'
  },
  code: {
    start: '```\n',
    end: '\n```'
  }
}

const blocks = {
  quote: {
    before: '> '
  },
  ol: {
    before: '1. '
  },
  ul: {
    before: '- '
  }
}

const newLines = {
  table: {
    content: '|column1|column2|column3|\n|-------|-------|-------|\n|content1|content2|content3|\n'
  }
}

export default {
  mixins: [markdown],
  components: {
    'v-md-toolbar-left': md_toolbar_left,
    'v-md-toolbar-right': md_toolbar_right
  },
  props: {
    scrollStyle: {
      // 是否渲染滚动条样式(webkit)
      type: Boolean,
      default: true
    },
    boxShadow: {
      // 是否添加阴影
      type: Boolean,
      default: true
    },
    transition: {
      // 是否开启动画过渡
      type: Boolean,
      default: true
    },
    autofocus: {
      // 是否自动获取焦点
      type: Boolean,
      default: true
    },
    toolbarsBackground: {
      // 工具栏背景色
      type: String,
      default: '#ffffff'
    },
    editorBackground: {
      type: String,
      default: '#ffffff'
    },
    previewBackground: {
      // 预览栏背景色
      type: String,
      default: '#fbfbfb'
    },
    boxShadowStyle: {
      // 阴影样式
      type: String,
      default: '0 2px 12px 0 rgba(0, 0, 0, 0.1)'
    },
    value: {
      // 初始 value
      type: String,
      default: ''
    },
    subfield: {
      type: Boolean,
      default: true
    },
    navigation: {
      type: Boolean,
      default: false
    },
    defaultOpen: {
      type: String,
      default: null
    },
    toolbarsFlag: {
      // 是否开启工具栏
      type: Boolean,
      default: true
    },
    toolbars: {
      // 工具栏
      type: Object,
      default() {
        return CONFIG.toolbars
      }
    },
    imageClick: {
      type: Function,
      default: null
    },
    tabSize: {
      type: Number,
      default: 4
    },
    shortCut: {
      type: Boolean,
      default: true
    },
    uploadRequest: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      s_subfield: (() => {
        return this.subfield
      })(),
      s_autofocus: true,
      // 标题导航
      s_navigation: (() => {
        return this.navigation
      })(),
      d_value: '', // props 文本内容
      d_render: '', // props 文本内容render
      s_preview_switch: (() => {
        let default_open_ = this.defaultOpen
        if (!default_open_) {
          default_open_ = this.subfield ? 'preview' : 'edit'
        }
        return default_open_ === 'preview'
      })(), // props true 展示编辑 false展示预览
      s_fullScreen: false, // 全屏编辑标志
      s_html_code: false, // 分栏情况下查看html
      s_readmodel: false,
      d_preview_imgsrc: null, // 图片预览地址
      cm: undefined
    }
  },
  mounted() {
    this.d_value = this.value || ''

    keydownListen(this)

    // 图片预览事件监听
    ImagePreviewListener(this)

    // fullscreen事件
    fullscreenchange(this)

    this.$nextTick(() => {
      this.handleInitEditor()
    })
  },

  watch: {
    d_value() {
      this.iRender()
    },
    value(val) {
      if (val !== this.d_value) {
        this.d_value = val || ''
        this.handleInitEditor()
      }
    },
    subfield(val) {
      this.s_subfield = val
    },
    defaultOpen(val) {
      let default_open_ = val
      if (!default_open_) {
        default_open_ = this.subfield ? 'preview' : 'edit'
      }
      return (this.s_preview_switch = default_open_ === 'preview')
    }
  },
  methods: {
    handleInitEditor() {
      if (this.cm) {
        this.cm.toTextArea()
      }
      this.cm = CodeMirror.fromTextArea(this.$refs.cmRef, {
        tabSize: this.tabSize,
        mode: 'text/markdown',
        theme: 'eclipse',
        lineNumbers: true,
        lineWrapping: true,
        line: true,
        styleActiveLine: true,
        highlightSelectionMatches: {
          annotateScrollbar: true
        },
        viewportMargin: 50,
        allowDropFileTypes: ['image/jpg', 'image/png', 'image/svg', 'image/jpeg', 'image/gif', 'image/webp'],
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        matchTags: { bothTags: true },
        autoCloseTags: true
      })

      // set default content
      this.cm.setValue(this.d_value)

      // clear default content history
      this.$nextTick(() => {
        this.cm.clearHistory()
      })

      // set focus
      if (this.autofocus) {
        this.setFocus()
      }

      // listen change event
      this.cm.on('change', c => {
        this.d_value = c.getValue() || ''
      })

      this.cm.on('paste', this.onCmPaste)

      this.cm.on('drop', this.onCmDrop)

      this.cm.on('scroll', this.onCmScroll)

      // mte-kernel
      const textEditorInterface = new TextEditorInterface(this.cm)
      textEditorInterface.init()
    },

    setHeading(level) {
      const curLine = this.cm.doc.getCursor('head').line
      let lineContent = this.cm.doc.getLine(curLine)
      const lineLength = lineContent.length
      if (lineContent.startsWith('#')) {
        lineContent = lineContent.replace(/^(#+ )/, '')
      }
      lineContent = times(level, () => '#').join('') + ' ' + lineContent
      this.cm.doc.replaceRange(lineContent, { line: curLine, ch: 0 }, { line: curLine, ch: lineLength })
    },

    setMarkup(start, end) {
      if (!end) {
        end = start
      }
      if (this.cm.doc.somethingSelected()) {
        this.cm.doc.replaceSelections(this.cm.doc.getSelections().map(s => start + s + end))
        return
      }
      // add markup to current line
      this.insetAtCursor(start + '' + end)
    },

    setEachLine(before, after) {
      let lines = []
      if (!this.cm.doc.somethingSelected()) {
        lines.push(this.cm.doc.getCursor('head').line)
      } else {
        lines = flatten(
          this.cm.doc.listSelections().map(sl => {
            const range = Math.abs(sl.anchor.line - sl.head.line) + 1
            const lowestLine = sl.anchor.line > sl.head.line ? sl.head.line : sl.anchor.line
            return times(range, l => l + lowestLine)
          })
        )
      }
      lines.forEach(ln => {
        let lineContent = this.cm.doc.getLine(ln)
        const lineLength = lineContent.length
        if (lineContent.startsWith(before)) {
          lineContent = lineContent.substring(before.length)
        }
        this.cm.doc.replaceRange(before + lineContent, { line: ln, ch: 0 }, { line: ln, ch: lineLength })
      })
      if (after) {
        const lastLine = last(lines)
        this.cm.doc.replaceRange(`\n${after}\n`, { line: lastLine, ch: this.cm.doc.getLine(lastLine).length + 1 })
      }
    },

    insertAfter(content) {
      const curLine = this.cm.doc.getCursor('to').line
      const lineLength = this.cm.doc.getLine(curLine).length
      this.cm.doc.replaceRange('\n' + content, { line: curLine, ch: lineLength + 1 })
    },

    insetAtCursor(content) {
      const cursor = this.cm.doc.getCursor('head')
      this.cm.doc.replaceRange(content, cursor)
    },

    setFocus() {
      this.cm.focus()
    },

    openImagePicker() {
      this.$emit('openImagePicker')
    },

    insertLink(text, link) {
      this.insetAtCursor(`[${text}](${link})`)
    },

    clickCommands(_type, options) {
      if (_type === 'save') {
        this.$emit('save')
        return
      }
      if (markups[_type]) {
        this.setMarkup(markups[_type].start, markups[_type].end)
        return
      }
      if (blocks[_type]) {
        this.setEachLine(blocks[_type].before, blocks[_type].after)
        return
      }
      if (newLines[_type]) {
        this.insertAfter(newLines[_type].content)
        return
      }
      if (_type === 'header') {
        this.setHeading(options.level)
        return
      }
      if (_type === 'undo') {
        this.cm.doc.undo()
        return
      }
      if (_type === 'redo') {
        this.cm.doc.redo()
      }
    },

    async onCmPaste(cm, e) {
      let { clipboardData } = e
      if (!clipboardData) {
        clipboardData = window.clipboardData
      }
      const { items } = clipboardData
      if (items.length === 0) {
        return
      }

      const types = clipboardData.types || []

      for (let i = 0; i < types.length; i++) {
        const item = items[i]
        if (item && item.kind === 'file' && item.type.startsWith('image/')) {
          e.preventDefault()
          e.stopPropagation()

          const file = item.getAsFile()

          if (file.size === 0) {
            return
          }
          const { path, name } = await this.uploadRequest(file)
          this.insetAtCursor(`![${name}](${path})`)
        }
      }
    },

    async onCmDrop(cm, e) {
      const files = e.dataTransfer.files
      if (files.length === 0) {
        return
      }
      for (let file of files) {
        if (file.size === 0) {
          return
        }
        if (file.type.startsWith('image/')) {
          e.preventDefault()
          e.stopPropagation()
          const { path, name } = await this.uploadRequest(file)
          this.insetAtCursor(`![${name}](${path})`)
        }
      }
    },

    onCmScroll(cm) {
      const scroller = cm.getScrollerElement()
      const { scrollTop, scrollHeight, clientHeight } = scroller
      const percent = scrollTop / scrollHeight
      const previewDom = this.$refs.vShowContent

      if (scrollTop <= 0) {
        this.setPreviewScrollTop(0)
        return
      }
      if (scrollTop + clientHeight >= scrollHeight) {
        previewDom.scrollTop = previewDom.scrollHeight
        return
      }
      this.setPreviewScrollTop(previewDom.scrollHeight * percent)
    },

    setPreviewScrollTop(scrollTop) {
      this.$refs.vShowContent.scrollTop = scrollTop
    },

    toolbar_right_click(_type) {
      toolbar_right_click(_type, this)
    },
    getNavigation($vm, full) {
      return getNavigation($vm, full)
    },

    // 切换全屏触发 （status , val）
    fullscreen(status, val) {
      this.$emit('fullScreen', status, val)
    },

    // 打开阅读模式触发（status , val）
    readmodel(status, val) {
      this.$emit('readModel', status, val)
    },

    // 切换阅读编辑触发 （status , val）
    previewtoggle(status, val) {
      this.$emit('previewToggle', status, val)
    },
    // 切换分栏触发 （status , val）
    subfieldtoggle(status, val) {
      this.$emit('subfieldToggle', status, val)
    },
    // 切换htmlcode触发 （status , val）
    htmlcode(status, val) {
      this.$emit('htmlCode', status, val)
    },
    // 监听ctrl + s
    save(val, render) {
      this.$emit('save', val, render)
    },
    // 导航栏切换
    navigationtoggle(status, val) {
      this.$emit('navigationToggle', status, val)
    },
    $toolbar_right_read_change_status() {
      this.s_readmodel = !this.s_readmodel
      if (this.readmodel) {
        this.readmodel(this.s_readmodel, this.d_value)
      }
      if (this.s_readmodel && this.toolbars.navigation) {
        this.getNavigation(this, true)
      }
    },

    iRender: debounce(function () {
      const _this = this
      _this.$render(_this.d_value || '', function (res) {
        // render
        _this.d_render = res
        _this.$emit('change', {
          originalContent: _this.d_value,
          renderContent: res
        })
        _this.$nextTick(() => {
          _this.renderHighlight()
          if (_this.s_navigation) getNavigation(_this, false)
        })
        _this.$emit('input', _this.d_value)
      })
    }, 300)
  }
}
</script>
<style lang="stylus">
@import 'lib/css/scroll.styl';
@import 'lib/css/halo-editor.styl';
</style>
