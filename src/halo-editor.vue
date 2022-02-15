<template>
  <div
      :class="[{ fullscreen: s_fullScreen, shadow: boxShadow }]"
      :style="{ 'box-shadow': boxShadow ? boxShadowStyle : '' }"
      class="v-note-wrapper markdown-body"
  >
    <!--工具栏-->
    <div
        v-show="toolbarsFlag"
        :style="{ background: toolbarsBackground }"
        class="v-note-op"
    >
      <v-md-toolbar-left
          ref="toolbar_left"
          :class="{ transition: transition }"
          :toolbars="toolbars"
          :transition="transition"
          @imgAdd="$imgAdd"
          @openImagePicker="openImagePicker"
          @toolbar_left_addlink="toolbar_left_addlink"
          @toolbar_left_click="toolbar_left_click"
      >
        <template #left-toolbar-before>
          <slot name="left-toolbar-before"/>
        </template>
        <template #left-toolbar-after>
          <slot name="left-toolbar-after"/>
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
          <slot name="right-toolbar-before"/>
        </template>
        <template #right-toolbar-after>
          <slot name="right-toolbar-after"/>
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
          'scroll-style-border-radius':
            scrollStyle && !s_preview_switch && !s_html_code,
          'single-edit': !s_preview_switch && !s_html_code,
          'single-show':
            (!s_subfield && s_preview_switch) || (!s_subfield && s_html_code),
          transition: transition,
        }"
          class="v-note-edit divarea-wrapper"
          @click="textAreaFocus"
          @scroll="$v_edit_scroll"
      >
        <div
            :style="{ 'background-color': editorBackground }"
            class="content-input-wrapper"
        >
          <!-- 双栏 -->
          <!--          <v-autoTextarea-->
          <!--            ref="vNoteTextarea"-->
          <!--            v-model="d_value"-->
          <!--            :fontSize="fontSize"-->
          <!--            :placeholder="placeholder ? placeholder : '开始编辑...'"-->
          <!--            :style="{ 'background-color': editorBackground }"-->
          <!--            class="content-input"-->
          <!--            fullHeight-->
          <!--            lineHeight="1.5"-->
          <!--          ></v-autoTextarea>-->
          <textarea ref="vNoteTextarea"></textarea>
        </div>
      </div>
      <!--展示区-->
      <div
          v-show="s_preview_switch || s_html_code"
          :class="{
          'single-show':
            (!s_subfield && s_preview_switch) || (!s_subfield && s_html_code),
        }"
          class="v-note-show"
      >
        <div
            v-show="!s_html_code"
            ref="vShowContent"
            :class="{
            'scroll-style': scrollStyle,
            'scroll-style-border-radius': scrollStyle,
          }"
            :style="{ 'background-color': previewBackground }"
            class="v-show-content"
            v-html="d_render"
        ></div>
        <div
            v-show="s_html_code"
            :class="{
            'scroll-style': scrollStyle,
            'scroll-style-border-radius': scrollStyle,
          }"
            :style="{ 'background-color': previewBackground }"
            class="v-show-content-html"
        >
          {{ d_render }}
        </div>
      </div>

      <!--标题导航-->
      <transition name="slideTop">
        <div
            v-show="s_navigation"
            :class="{ transition: transition }"
            class="v-note-navigation-wrapper"
        >
          <div class="v-note-navigation-title">
            导航目录<i
              aria-hidden="true"
              class="fa fa-halo-times v-note-navigation-close"
              @click="toolbar_right_click('navigation')"
          ></i>
          </div>
          <div
              ref="navigationContent"
              :class="{ 'scroll-style': scrollStyle }"
              class="v-note-navigation-content"
          ></div>
        </div>
      </transition>
    </div>
    <!-- 预览图片 -->
    <transition name="fade">
      <div
          v-if="d_preview_imgsrc"
          class="v-note-img-wrapper"
          @click="d_preview_imgsrc = null"
      >
        <img :src="d_preview_imgsrc" alt="none"/>
      </div>
    </transition>
    <!--阅读模式-->
    <div
        ref="vReadModel"
        :class="{ show: s_readmodel }"
        class="v-note-read-model scroll-style"
    >
      <div
          ref="vNoteReadContent"
          class="v-note-read-content"
          v-html="d_render"
      ></div>
    </div>
  </div>
</template>

<script>
import {keydownListen} from "./lib/core/keydown-listen.js";
import {
  fullscreenchange,
  getNavigation,
  ImagePreviewListener,
  insertEnter,
  insertOl,
  insertTab,
  insertTextAtCaret,
  insertUl,
  loadLink,
  loadScript,
  removeLine,
  scrollLink,
  unInsertTab
} from "./lib/core/extra-function.js";
import {stopEvent} from "./lib/util.js";
import {
  toolbar_left_addlink,
  toolbar_left_click
} from "./lib/toolbar_left_click.js";
import {toolbar_right_click} from "./lib/toolbar_right_click.js";
import {CONFIG} from "./lib/config.js";
import markdown from "./lib/mixins/markdown.js";

import md_toolbar_left from "./components/md-toolbar-left.vue";
import md_toolbar_right from "./components/md-toolbar-right.vue";
import "./lib/font/css/fontello.css";
import "github-markdown-css/github-markdown.css";

// Code Mirror
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'

// Language
import 'codemirror/mode/markdown/markdown.js'

// Addons
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/display/fullscreen.js'
import 'codemirror/addon/display/fullscreen.css'
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/foldgutter.css'

export default {
  mixins: [markdown],
  components: {
    "v-md-toolbar-left": md_toolbar_left,
    "v-md-toolbar-right": md_toolbar_right
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
    fontSize: {
      // 字体大小
      type: String,
      default: "15px"
    },
    toolbarsBackground: {
      // 工具栏背景色
      type: String,
      default: "#ffffff"
    },
    editorBackground: {
      type: String,
      default: "#ffffff"
    },
    previewBackground: {
      // 预览栏背景色
      type: String,
      default: "#fbfbfb"
    },
    boxShadowStyle: {
      // 阴影样式
      type: String,
      default: "0 2px 12px 0 rgba(0, 0, 0, 0.1)"
    },
    value: {
      // 初始 value
      type: String,
      default: ""
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
        return CONFIG.toolbars;
      }
    },
    placeholder: {
      // 编辑器默认内容
      type: String,
      default: null
    },
    externalLink: {
      type: [Object, Boolean],
      default: true
    },
    imageClick: {
      type: Function,
      default: null
    },
    tabSize: {
      type: Number,
      default: 0
    },
    shortCut: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      s_subfield: (() => {
        return this.subfield;
      })(),
      s_autofocus: true,
      // 标题导航
      s_navigation: (() => {
        return this.navigation;
      })(),
      d_value: "", // props 文本内容
      d_render: "", // props 文本内容render
      s_preview_switch: (() => {
        let default_open_ = this.defaultOpen;
        if (!default_open_) {
          default_open_ = this.subfield ? "preview" : "edit";
        }
        return default_open_ === "preview";
      })(), // props true 展示编辑 false展示预览
      s_fullScreen: false, // 全屏编辑标志
      s_html_code: false, // 分栏情况下查看html
      edit_scroll_height: -1,
      s_readmodel: false,
      s_table_enter: false, // 回车事件是否在表格中执行
      d_history: (() => {
        let temp_array = [];
        temp_array.push(this.value);
        return temp_array;
      })(), // 编辑记录
      d_history_index: 0, // 编辑记录索引
      currentTimeout: "",
      d_image_file: [],
      d_preview_imgsrc: null, // 图片预览地址
      p_external_link: {},
      cm: undefined
    };
  },
  mounted() {
    const _this = this;
    this.$el.addEventListener("paste", function (e) {
      _this.$paste(e);
    });
    this.$el.addEventListener("drop", function (e) {
      _this.$drag(e);
    });
    // 浏览器siz大小
    /* windowResize(this); */
    keydownListen(this);
    // 图片预览事件监听
    ImagePreviewListener(this);
    // TODO 设置默认焦点
    // fullscreen事件
    fullscreenchange(this);

    this.d_value = this.value;

    this.$nextTick(() => {
      this.handleInitEditor()
    })
  },
  methods: {
    handleInitEditor() {
      this.cm = CodeMirror.fromTextArea(this.$refs.vNoteTextarea, {
        tabSize: 2,
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

      // listen change event
      this.cm.on('change', c => {
        this.d_value = c.getValue()
      })
    },
    openImagePicker() {
      this.$emit("openImagePicker");
    },
    textAreaFocus() {
      this.$refs.vNoteTextarea.$refs.vTextarea.focus();
    },
    $drag($e) {
      var dataTransfer = $e.dataTransfer;
      if (dataTransfer) {
        var files = dataTransfer.files;
        if (files.length > 0) {
          $e.preventDefault();
          this.$refs.toolbar_left.$imgFilesAdd(files);
        }
      }
    },
    $paste($e) {
      var clipboardData = $e.clipboardData;
      if (clipboardData) {
        var items = clipboardData.items;
        if (!items) return;
        var types = clipboardData.types || [];
        var item = null;
        for (var i = 0; i < types.length; i++) {
          if (types[i] === "Files") {
            item = items[i];
            break;
          }
        }
        if (item && item.kind === "file") {
          // prevent filename being pasted parallel along
          // with the image pasting process
          stopEvent($e);
          var oFile = item.getAsFile();
          this.$refs.toolbar_left.$imgFilesAdd([oFile]);
        }
      }
    },
    $imgAdd(pos, $file, isinsert) {
      if (isinsert === undefined) isinsert = true;
      const $vm = this;
      if (this.__rFilter == null) {
        this.__rFilter = /^image\//i;
      }
      this.__oFReader = new FileReader();
      this.__oFReader.onload = function (oFREvent) {
        $vm.markdownIt.image_add(pos, oFREvent.target.result);
        $file.miniurl = oFREvent.target.result;
        if (isinsert === true) {
          // 去除特殊字符
          $file._name = $file.name.replace(
              /[\[\]\(\)\+\{\}&\|\\\*^%$#@\-]/g,
              ""
          );

          $vm.insertText($vm.getTextareaDom(), {
            prefix: "![" + $file._name + "](" + pos + ")",
            subfix: "",
            str: ""
          });
          $vm.$nextTick(function () {
            $vm.$emit("imgAdd", pos, $file);
          });
        }
      };
      if ($file) {
        const oFile = $file;
        if (this.__rFilter.test(oFile.type)) {
          this.__oFReader.readAsDataURL(oFile);
        }
      }
    },
    $imgUpdateByUrl(pos, url) {
      var $vm = this;
      this.markdownIt.image_add(pos, url);
      this.$nextTick(function () {
        $vm.d_render = this.markdownIt.render(this.d_value);
      });
    },
    $img2Url(fileIndex, url) {
      var reg_str =
          "/(!\\[[^\\[]*?\\](?=\\())\\(\\s*(" + fileIndex + ")\\s*\\)/g";
      var reg = eval(reg_str);
      this.d_value = this.d_value.replace(reg, "$1(" + url + ")");
      this.$refs.toolbar_left.$changeUrl(fileIndex, url);
      this.iRender();
    },
    $imglst2Url(imglst) {
      if (imglst instanceof Array) {
        for (var i = 0; i < imglst.length; i++) {
          this.$img2Url(imglst[i][0], imglst[i][1]);
        }
      }
    },
    toolbar_left_click(_type) {
      toolbar_left_click(_type, this);
    },
    toolbar_left_addlink(text, link) {
      toolbar_left_addlink(text, link, this);
    },
    toolbar_right_click(_type) {
      toolbar_right_click(_type, this);
    },
    getNavigation($vm, full) {
      return getNavigation($vm, full);
    },
    // @event
    // 修改数据触发 （val ， val_render）
    change(val, render) {
      this.$emit("change", val, render);
    },
    // 切换全屏触发 （status , val）
    fullscreen(status, val) {
      this.$emit("fullScreen", status, val);
    },
    // 打开阅读模式触发（status , val）
    readmodel(status, val) {
      this.$emit("readModel", status, val);
    },
    // 切换阅读编辑触发 （status , val）
    previewtoggle(status, val) {
      this.$emit("previewToggle", status, val);
    },
    // 切换分栏触发 （status , val）
    subfieldtoggle(status, val) {
      this.$emit("subfieldToggle", status, val);
    },
    // 切换htmlcode触发 （status , val）
    htmlcode(status, val) {
      this.$emit("htmlCode", status, val);
    },
    // 监听ctrl + s
    save(val, render) {
      this.$emit("save", val, render);
    },
    // 导航栏切换
    navigationtoggle(status, val) {
      this.$emit("navigationToggle", status, val);
    },
    $toolbar_right_read_change_status() {
      this.s_readmodel = !this.s_readmodel;
      if (this.readmodel) {
        this.readmodel(this.s_readmodel, this.d_value);
      }
      if (this.s_readmodel && this.toolbars.navigation) {
        this.getNavigation(this, true);
      }
    },
    // ---------------------------------------
    // 滚动条联动
    $v_edit_scroll($event) {
      scrollLink($event, this);
    },
    // 获取textarea dom节点
    getTextareaDom() {
      return this.$refs.vNoteTextarea.$refs.vTextarea;
    },
    // 工具栏插入内容
    insertText(obj, {prefix, subfix, str, type}) {
      // if (this.s_preview_switch) {

      insertTextAtCaret(obj, {prefix, subfix, str, type}, this);
    },
    insertTab() {
      insertTab(this, this.tabSize);
    },
    insertOl() {
      insertOl(this);
    },
    removeLine() {
      removeLine(this);
    },
    insertUl() {
      insertUl(this);
    },
    unInsertTab() {
      unInsertTab(this, this.tabSize);
    },
    insertEnter(event) {
      insertEnter(this, event);
    },
    saveHistory() {
      this.d_history.splice(this.d_history_index + 1, this.d_history.length);
      this.d_history.push(this.d_value);
      this.d_history_index = this.d_history.length - 1;
    },
    iRender(toggleChange) {
      var $vm = this;
      this.$render($vm.d_value, function (res) {
        // render
        $vm.d_render = res;
        $vm.$nextTick(() => {
          $vm.renderMermaidDiagrams();
        });
        // change回调  toggleChange == false 时候触发change回调
        if (!toggleChange) {
          if ($vm.change) $vm.change($vm.d_value, $vm.d_render);
        }
        // 改变标题导航
        if ($vm.s_navigation) getNavigation($vm, false);
        // v-model 语法糖
        $vm.$emit("input", $vm.d_value);
        // 塞入编辑记录数组
        if ($vm.d_value === $vm.d_history[$vm.d_history_index]) return;
        window.clearTimeout($vm.currentTimeout);
        $vm.currentTimeout = setTimeout(() => {
          $vm.saveHistory();
        }, 500);
      });
    },
    // 清空上一步 下一步缓存
    $emptyHistory() {
      this.d_history = [this.d_value]; // 编辑记录
      this.d_history_index = 0; // 编辑记录索引
    }
  },
  watch: {
    d_value: function (val, oldVal) {
      this.iRender();
    },
    value: function (val, oldVal) {
      if (val !== this.d_value) {
        this.d_value = val;
      }
    },
    subfield: function (val, oldVal) {
      this.s_subfield = val;
    },
    d_history_index() {
      if (this.d_history_index > 20) {
        this.d_history.shift();
        this.d_history_index = this.d_history_index - 1;
      }
      this.d_value = this.d_history[this.d_history_index];
    },
    defaultOpen: function (val) {
      let default_open_ = val;
      if (!default_open_) {
        default_open_ = this.subfield ? "preview" : "edit";
      }
      return (this.s_preview_switch = default_open_ === "preview");
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import 'lib/css/scroll.styl';
@import 'lib/css/halo-editor.styl';
</style>
