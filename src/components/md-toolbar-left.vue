<template>
  <div class="v-left-item">
    <slot name="left-toolbar-before"/>
    <button
        v-if="toolbars.bold"
        aria-hidden="true"
        class="op-icon fa fa-halo-bold"
        title="粗体 (Ctrl+B)"
        type="button"
        @click="$clicks('bold')"
    >

    </button>
    <button
        v-if="toolbars.italic"
        aria-hidden="true"
        class="op-icon fa fa-halo-italic"
        title="斜体 (Ctrl+I)"
        type="button"
        @click="$clicks('italic')"
    ></button>
    <div
        v-if="toolbars.header"
        :class="{'selected': s_header_dropdown_open}"
        aria-hidden="true"
        class="op-icon fa fa-halo-header dropdown dropdown-wrapper"
        title="标题 (Ctrl+H)"
        type="button"
        @mouseenter="$mouseenter_header_dropdown"
        @mouseleave="$mouseleave_header_dropdown"
    >
      <transition name="fade">
        <div
            v-show="s_header_dropdown_open"
            :class="{'transition': transition}"
            class="op-header popup-dropdown"
            @mouseenter="$mouseenter_header_dropdown"
            @mouseleave="$mouseleave_header_dropdown"
        >
          <div
              class="dropdown-item"
              title="#"
              @click.stop="$click_header('header1')"
          ><span>一级标题</span></div>
          <div
              class="dropdown-item"
              title="## "
              @click.stop="$click_header('header2')"
          ><span>二级标题</span></div>
          <div
              class="dropdown-item"
              title="### "
              @click.stop="$click_header('header3')"
          ><span>三级标题</span></div>
          <div
              class="dropdown-item"
              title="#### "
              @click.stop="$click_header('header4')"
          ><span>四级标题</span></div>
          <div
              class="dropdown-item"
              title="##### "
              @click.stop="$click_header('header5')"
          ><span>五级标题</span></div>
          <div
              class="dropdown-item"
              title="###### "
              @click.stop="$click_header('header6')"
          ><span>六级标题</span></div>
        </div>
      </transition>
    </div>
    <span
        v-if="toolbars.header || toolbars.italic || toolbars.bold"
        class="op-icon-divider"
    ></span>
    <button
        v-if="toolbars.underline"
        aria-hidden="true"
        class="op-icon fa fa-halo-underline"
        title="下划线 (Ctrl+U)"
        type="button"
        @click="$clicks('underline')"
    ></button>
    <button
        v-if="toolbars.strikethrough"
        aria-hidden="true"
        class="op-icon fa fa-halo-strikethrough"
        title="中划线 (Ctrl+Shift+D)"
        type="button"
        @click="$clicks('strikethrough')"
    ></button>
    <button
        v-if="toolbars.superscript"
        aria-hidden="true"
        class="op-icon fa fa-halo-superscript"
        title="上角标 (Ctrl+Alt+S)"
        type="button"
        @click="$clicks('superscript')"
    ></button>
    <button
        v-if="toolbars.subscript"
        aria-hidden="true"
        class="op-icon fa fa-halo-subscript"
        title="下角标 (Ctrl+Shift+S)"
        type="button"
        @click="$clicks('subscript')"
    ></button>
    <span
        v-if="toolbars.superscript || toolbars.subscript || toolbars.underline || toolbars.strikethrough"
        class="op-icon-divider"
    ></span>
    <button
        v-if="toolbars.quote"
        aria-hidden="true"
        class="op-icon fa fa-halo-quote-left"
        title="段落引用 (Ctrl+Q)"
        type="button"
        @click="$clicks('quote')"
    ></button>
    <button
        v-if="toolbars.ol"
        aria-hidden="true"
        class="op-icon fa fa-halo-list-ol"
        title="有序列表 (Ctrl+O)"
        type="button"
        @click="$clicks('ol')"
    ></button>
    <button
        v-if="toolbars.ul"
        aria-hidden="true"
        class="op-icon fa fa-halo-list-ul"
        title="无序列表 (Ctrl+Alt+U)"
        type="button"
        @click="$clicks('ul')"
    ></button>
    <span
        v-if="toolbars.ul || toolbars.ol || toolbars.quote"
        class="op-icon-divider"
    ></span>
    <button
        v-if="toolbars.link"
        aria-hidden="true"
        class="op-icon fa fa-halo-link"
        title="链接 (Ctrl+L)"
        type="button"
        @click.stop="handleOpenLinkAddModal('link')"
    ></button>
    <button
        v-if="toolbars.imagelink"
        aria-hidden="true"
        class="op-icon fa fa-halo-picture-o"
        type="button"
        @click.stop="handleOpenImagePicker"
    ></button>
    <button
        v-if="toolbars.code"
        aria-hidden="true"
        class="op-icon fa fa-halo-code"
        title="代码块 (Ctrl+Alt+C)"
        type="button"
        @click="$clicks('code')"
    ></button>
    <button
        v-if="toolbars.table"
        aria-hidden="true"
        class="op-icon fa fa-halo-table"
        title="表格 (Ctrl+Alt+T)"
        type="button"
        @click="$clicks('table')"
    ></button>
    <span
        v-if="toolbars.link || toolbars.imagelink || toolbars.code || toolbars.table"
        class="op-icon-divider"
    ></span>
    <button
        v-if="toolbars.undo"
        aria-hidden="true"
        class="op-icon fa fa-halo-undo"
        title="上一步 (Ctrl+Z)"
        type="button"
        @click="$clicks('undo')"
    ></button>
    <button
        v-if="toolbars.redo"
        aria-hidden="true"
        class="op-icon fa fa-halo-repeat"
        title="下一步 (Ctrl+Y)"
        type="button"
        @click="$clicks('redo')"
    ></button>
    <button
        v-if="toolbars.trash"
        aria-hidden="true"
        class="op-icon fa fa-halo-trash-o"
        title="清空 (Ctrl+BreakSpace)"
        type="button"
        @click="$clicks('trash')"
    ></button>
    <button
        v-if="toolbars.save"
        aria-hidden="true"
        class="op-icon fa fa-halo-floppy-o"
        title="保存 (Ctrl+S)"
        type="button"
        @click="$clicks('save')"
    ></button>
    <slot name="left-toolbar-after"/>

    <!-- 添加image链接 -->
    <transition name="fade">
      <div
          v-if="s_img_link_open"
          class="add-image-link-wrapper"
      >
        <div class="add-image-link">
          <i
              aria-hidden="true"
              class="fa fa-halo-times"
              @click.stop.prevent="s_img_link_open = false"
          ></i>
          <h3 class="title">添加链接</h3>
          <div class="link-text input-wrapper">
            <input
                ref="linkTextInput"
                v-model="link_text"
                placeholder="链接描述"
                type="text"
            >
          </div>
          <div class="link-addr input-wrapper">
            <input
                v-model="link_addr"
                placeholder="链接地址"
                type="text"
            >
          </div>
          <div
              class="op-btn cancel"
              @click.stop="s_img_link_open = false"
          >取消
          </div>
          <div
              class="op-btn sure"
              @click.stop="handleAddLink()"
          >确定
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: "s-md-toolbar-left",
  props: {
    transition: {
      type: Boolean,
      default: true
    },
    toolbars: {
      // 工具栏
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // [index, file]
      img_file: [[0, null]],
      header_timer: null,
      s_img_dropdown_open: false,
      s_header_dropdown_open: false,
      s_img_link_open: false,
      trigger: null,
      num: 0,
      link_text: "",
      link_addr: ""
    };
  },
  methods: {
    handleOpenImagePicker() {
      this.$emit("openImagePicker");
    },
    handleAddLink() {
      this.$emit(
          "toolbar_left_addlink",
          this.link_text,
          this.link_addr
      );
      this.s_img_link_open = false;
    },
    handleOpenLinkAddModal(type) {
      this.link_text = this.link_addr = "";
      this.s_img_link_open = true;
      this.$nextTick(() => {
        this.$refs.linkTextInput.focus();
      });
      this.s_img_dropdown_open = false;
    },
    $changeUrl(index, url) {
      this.img_file[index][0] = url;
    },
    $imgFileAdd($file) {
      this.img_file.push([++this.num, $file]);
      this.$emit("imgAdd", this.num, $file);
      this.s_img_dropdown_open = false;
    },
    $imgFilesAdd($files) {
      for (let i = 0; i < $files.length; i++) {
        if ($files[i].type.match(/^image\//i)) {
          this.$imgFileAdd($files[i]);
        }
      }
    },
    $imgAdd($e) {
      this.$imgFilesAdd($e.target.files);
      $e.target.value = ""; // 初始化
    },
    $mouseenter_header_dropdown() {
      clearTimeout(this.header_timer);
      this.s_header_dropdown_open = true;
    },
    $mouseleave_header_dropdown() {
      let vm = this;
      this.header_timer = setTimeout(function () {
        vm.s_header_dropdown_open = false;
      }, 200);
    },
    $clicks(_type) {
      // 让父节点来绑定事件并
      this.$emit("toolbar_left_click", _type);
    },
    $click_header(_type) {
      // 让父节点来绑定事件并
      this.$emit("toolbar_left_click", _type);
      this.s_header_dropdown_open = false;
    }
  }
};
</script>
<style lang="stylus" scoped>
.op-icon.dropdown-wrapper.dropdown {
  position: relative;

  &[type=button] {
    -webkit-appearance: unset;
  }

  .popup-dropdown {
    position: absolute;
    display: block;
    background: #fff;
    top: 32px;
    left: -45px;
    min-width: 130px;
    z-index: 1600;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .dropdown-item:first-child {
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }

    .dropdown-item:last-child {
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
    }

    &.op-header {
      left: -30px;
      min-width: 90px;
    }

    &.fade-enter-active, &.fade-leave-active {
      opacity: 1;
    }

    &.fade-enter, &.fade-leave-active {
      opacity: 0;
    }

    &.transition {
      &, .dropdown-item {
        transition: all 0.2s linear 0s;
      }
    }
  }

  .dropdown-item {
    height: 40px;
    line-height: @height;
    font-size: 14px;
    color: #606266;
    position: relative;

    &:hover {
      color: #303133;
      background-color: #e9e9eb;
    }

    input {
      position: absolute;
      font-size: 100px;
      right: 0;
      top: 0;
      opacity: 0;
      cursor: pointer;
    }
  }
}

.add-image-link-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1600;
  transition: all 0.1s linear 0s;

  &.fade-enter-active, &.fade-leave-active {
    opacity: 1;
  }

  &.fade-enter, &.fade-leave-active {
    opacity: 0;
  }

  .add-image-link {
    position: fixed;
    box-sizing: border-box;
    text-align: center;
    width: 24%;
    left: 38%;

    @media only screen and (max-width: 1500px) {
      width: 34%;
      left: 33%;
    }

    @media only screen and (max-width: 1000px) {
      width: 50%;
      left: 25%;
    }

    @media only screen and (max-width: 600px) {
      width: 80%;
      left: 10%;
    }

    height: auto;
    padding: 40px;
    top: 25%;
    transition: all 0.1s linear 0s;
    z-index: 3;
    background: #fff;
    border-radius: 2px;

    i {
      font-size: 18px;
      position: absolute;
      right: 8px;
      top: 6px;
      color: rgba(0, 0, 0, 0.7);
      cursor: pointer;
    }

    .title {
      font-size: 20px;
      margin-bottom: 30px;
      margin-top: 10px;
      font-weight: 500 !important;
    }

    .input-wrapper {
      margin-top: 10px;
      width: 80%;
      border: 1px solid #eeece8;
      text-align: left;
      margin-left: 10%;
      height: 35px;

      input {
        height: 32px;
        line-height: 32px;
        font-size: 15px;
        width: 90%;
        margin-left: 8px;
        border: none;
        outline: none;
      }
    }

    .op-btn {
      width: 100px;
      height: 35px;
      display: inline-block;
      margin-top: 30px;
      cursor: pointer;
      text-align: center;
      line-height: @height;
      opacity: 0.9;
      border-radius: 2px;
      letter-spacing: 1px;
      font-size: 15px;
    }

    .op-btn.sure {
      background: #2185d0;
      color: #fff;
      margin-left: 5%;

      &:hover {
        opacity: 1;
      }
    }

    .op-btn.cancel {
      border: 1px solid #bcbcbc;
      color: #bcbcbc;

      &:hover {
        color: #000;
      }
    }
  }
}
</style>
