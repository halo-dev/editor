<template>
  <div
    :class="[{ fullscreen: s_fullScreen, shadow: boxShadow }]"
    :style="{ 'box-shadow': boxShadow ? boxShadowStyle : '' }"
    class="v-note-wrapper markdown-body"
  >
    <!--工具栏-->
    <div v-show="toolbarsFlag" :style="{ background: toolbarsBackground }" class="v-note-op">
      <v-md-toolbar-left
        ref="toolbar_left"
        :class="{ transition: transition }"
        :toolbars="toolbars"
        :transition="transition"
        @clickCommands="clickCommands"
        @imgAdd="$imgAdd"
        @insertLink="insertLink"
        @openImagePicker="openImagePicker"
      >
        <template #left-toolbar-before>
          <slot name="left-toolbar-before" />
        </template>
        <template #left-toolbar-after>
          <slot name="left-toolbar-after" />
        </template>
      </v-md-toolbar-left>
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
      >
        <template #right-toolbar-before>
          <slot name="right-toolbar-before" />
        </template>
        <template #right-toolbar-after>
          <slot name="right-toolbar-after" />
        </template>
      </v-md-toolbar-right>
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
        @scroll="$v_edit_scroll"
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
            导航目录<i
              aria-hidden="true"
              class="fa fa-halo-times v-note-navigation-close"
              @click="toolbar_right_click('navigation')"
            ></i>
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
import {
  fullscreenchange,
  getNavigation,
  ImagePreviewListener,
  insertTextAtCaret,
  scrollLink
} from './lib/core/extra-function.js'
import { toolbar_right_click } from './lib/toolbar_right_click.js'
import { CONFIG } from './lib/config.js'
import markdown from './lib/mixins/markdown.js'

import md_toolbar_left from './components/md-toolbar-left.vue'
import md_toolbar_right from './components/md-toolbar-right.vue'
import './lib/font/css/fontello.css'

// libs
import times from 'lodash.times'
import flatten from 'lodash.flatten'
import last from 'lodash.last'
import 'github-markdown-css/github-markdown-light.css'

// CodeMirror
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'

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
      default: 2
    },
    shortCut: {
      type: Boolean,
      default: true
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
      edit_scroll_height: -1,
      s_readmodel: false,
      s_table_enter: false, // 回车事件是否在表格中执行
      d_history: (() => {
        let temp_array = []
        temp_array.push(this.value)
        return temp_array
      })(), // 编辑记录
      d_history_index: 0, // 编辑记录索引
      d_image_file: [],
      d_preview_imgsrc: null, // 图片预览地址
      cm: undefined
    }
  },
  mounted() {
    this.d_value = this.value

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
    d_value: function () {
      this.iRender()
    },
    value: function (val) {
      if (val !== this.d_value) {
        this.d_value = val
        this.handleInitEditor()
      }
    },
    subfield: function (val) {
      this.s_subfield = val
    },
    defaultOpen: function (val) {
      let default_open_ = val
      if (!default_open_) {
        default_open_ = this.subfield ? 'preview' : 'edit'
      }
      return (this.s_preview_switch = default_open_ === 'preview')
    }
  },
  methods: {
    handleInitEditor() {
      this.cm = CodeMirror.fromTextArea(this.$refs.cmRef, {
        tabSize: this.tabSize,
        mode: 'text/markdown',
        // theme: 'idea',
        lineNumbers: true,
        lineWrapping: true,
        line: true,
        styleActiveLine: true,
        highlightSelectionMatches: {
          annotateScrollbar: true
        },
        viewportMargin: 50,
        inputStyle: 'contenteditable',
        allowDropFileTypes: ['image/jpg', 'image/png', 'image/svg', 'image/jpeg', 'image/gif'],
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
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
        this.d_value = c.getValue()
      })
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

    $imgAdd(pos, $file, isinsert) {
      if (isinsert === undefined) isinsert = true
      const $vm = this
      if (this.__rFilter == null) {
        this.__rFilter = /^image\//i
      }
      this.__oFReader = new FileReader()
      this.__oFReader.onload = function (oFREvent) {
        $vm.markdownIt.image_add(pos, oFREvent.target.result)
        $file.miniurl = oFREvent.target.result
        if (isinsert === true) {
          // 去除特殊字符
          // $file._name = $file.name.replace(/[\[\](\)\+\{\}&\|\\\*^%$#@\-]/g, '')

          $vm.insertText($vm.getTextareaDom(), {
            prefix: '![' + $file._name + '](' + pos + ')',
            subfix: '',
            str: ''
          })
          $vm.$nextTick(function () {
            $vm.$emit('imgAdd', pos, $file)
          })
        }
      }
      if ($file) {
        const oFile = $file
        if (this.__rFilter.test(oFile.type)) {
          this.__oFReader.readAsDataURL(oFile)
        }
      }
    },
    $imgUpdateByUrl(pos, url) {
      var $vm = this
      this.markdownIt.image_add(pos, url)
      this.$nextTick(function () {
        $vm.d_render = this.markdownIt.render(this.d_value)
      })
    },
    $img2Url(fileIndex, url) {
      var reg_str = '/(!\\[[^\\[]*?\\](?=\\())\\(\\s*(' + fileIndex + ')\\s*\\)/g'
      var reg = eval(reg_str)
      this.d_value = this.d_value.replace(reg, '$1(' + url + ')')
      this.$refs.toolbar_left.$changeUrl(fileIndex, url)
      this.iRender()
    },
    $imglst2Url(imglst) {
      if (imglst instanceof Array) {
        for (var i = 0; i < imglst.length; i++) {
          this.$img2Url(imglst[i][0], imglst[i][1])
        }
      }
    },
    clickCommands(_type, options) {
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
    toolbar_right_click(_type) {
      toolbar_right_click(_type, this)
    },
    getNavigation($vm, full) {
      return getNavigation($vm, full)
    },
    // @event
    // 修改数据触发 （val ， val_render）
    change(val, render) {
      this.$emit('change', val, render)
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
    // ---------------------------------------
    // 滚动条联动
    $v_edit_scroll($event) {
      scrollLink($event, this)
    },
    // 获取textarea dom节点
    getTextareaDom() {
      return this.$refs.cmRef.$refs.vTextarea
    },
    // 工具栏插入内容
    insertText(obj, { prefix, subfix, str, type }) {
      // if (this.s_preview_switch) {

      insertTextAtCaret(obj, { prefix, subfix, str, type }, this)
    },
    iRender(toggleChange) {
      var $vm = this
      this.$render($vm.d_value, function (res) {
        // render
        $vm.d_render = res
        $vm.$nextTick(() => {
          $vm.renderMermaidDiagrams()
        })
        // change回调  toggleChange == false 时候触发change回调
        if (!toggleChange) {
          if ($vm.change) $vm.change($vm.d_value, $vm.d_render)
        }
        // 改变标题导航
        if ($vm.s_navigation) getNavigation($vm, false)
        // v-model 语法糖
        $vm.$emit('input', $vm.d_value)
      })
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import 'lib/css/scroll.styl';
@import 'lib/css/halo-editor.styl';
</style>
