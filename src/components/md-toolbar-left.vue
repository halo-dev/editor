<template>
  <div class="v-left-item">
    <slot name="left-toolbar-before" />
    <button
      :disabled="!editable"
      type="button"
      v-if="toolbars.bold"
      @click="$clicks('bold')"
      class="op-icon fa fa-halo-bold"
      aria-hidden="true"
      :title="`粗体 (Ctrl+B)`"
    ></button>
    <button
      :disabled="!editable"
      type="button"
      v-if="toolbars.italic"
      @click="$clicks('italic')"
      class="op-icon fa fa-halo-italic"
      aria-hidden="true"
      :title="`斜体 (Ctrl+I)`"
    ></button>
    <div
      :class="{'selected': s_header_dropdown_open}"
      :disabled="!editable"
      type="button"
      v-if="toolbars.header"
      @mouseleave="$mouseleave_header_dropdown"
      @mouseenter="$mouseenter_header_dropdown"
      class="op-icon fa fa-halo-header dropdown dropdown-wrapper"
      aria-hidden="true"
      :title="`标题 (Ctrl+H)`"
    >
      <transition name="fade">
        <div
          class="op-header popup-dropdown"
          :class="{'transition': transition}"
          v-show="s_header_dropdown_open"
          @mouseenter="$mouseenter_header_dropdown"
          @mouseleave="$mouseleave_header_dropdown"
        >
          <div
            title="#"
            class="dropdown-item"
            @click.stop="$click_header('header1')"
          ><span>一级标题</span></div>
          <div
            title="## "
            class="dropdown-item"
            @click.stop="$click_header('header2')"
          ><span>二级标题</span></div>
          <div
            title="### "
            class="dropdown-item"
            @click.stop="$click_header('header3')"
          ><span>三级标题</span></div>
          <div
            title="#### "
            class="dropdown-item"
            @click.stop="$click_header('header4')"
          ><span>四级标题</span></div>
          <div
            title="##### "
            class="dropdown-item"
            @click.stop="$click_header('header5')"
          ><span>五级标题</span></div>
          <div
            title="###### "
            class="dropdown-item"
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
      :disabled="!editable"
      type="button"
      v-if="toolbars.underline"
      @click="$clicks('underline')"
      class="op-icon fa fa-halo-underline"
      :title="`下划线 (Ctrl+U)`"
      aria-hidden="true"
    ></button>
    <button
      :disabled="!editable"
      type="button"
      v-if="toolbars.strikethrough"
      @click="$clicks('strikethrough')"
      class="op-icon fa fa-halo-strikethrough"
      :title="`中划线 (Ctrl+Shift+D)`"
      aria-hidden="true"
    ></button>
    <button
      :disabled="!editable"
      type="button"
      v-if="toolbars.superscript"
      @click="$clicks('superscript')"
      class="op-icon fa fa-halo-superscript"
      aria-hidden="true"
      :title="`上角标 (Ctrl+Alt+S)`"
    ></button>
    <button
      :disabled="!editable"
      type="button"
      v-if="toolbars.subscript"
      @click="$clicks('subscript')"
      class="op-icon fa fa-halo-subscript"
      aria-hidden="true"
      :title="`下角标 (Ctrl+Shift+S)`"
    ></button>
    <span
      v-if="toolbars.superscript || toolbars.subscript || toolbars.underline || toolbars.strikethrough"
      class="op-icon-divider"
    ></span>
    <button
      :disabled="!editable"
      type="button"
      v-if="toolbars.quote"
      @click="$clicks('quote')"
      class="op-icon fa fa-halo-quote-left"
      aria-hidden="true"
      :title="`段落引用 (Ctrl+Q)`"
    ></button>
    <button
      :disabled="!editable"
      type="button"
      v-if="toolbars.ol"
      @click="$clicks('ol')"
      class="op-icon fa fa-halo-list-ol"
      aria-hidden="true"
      :title="`有序列表 (Ctrl+O)`"
    ></button>
    <button
      :disabled="!editable"
      type="button"
      v-if="toolbars.ul"
      @click="$clicks('ul')"
      class="op-icon fa fa-halo-list-ul"
      aria-hidden="true"
      :title="`无序列表 (Ctrl+Alt+U)`"
    ></button>
    <span
      v-if="toolbars.ul || toolbars.ol || toolbars.quote"
      class="op-icon-divider"
    ></span>
    <button
      :disabled="!editable"
      type="button"
      v-if="toolbars.link"
      @click.stop="$toggle_imgLinkAdd('link')"
      class="op-icon fa fa-halo-link"
      aria-hidden="true"
      :title="`链接 (Ctrl+L)`"
    ></button>
    <div
      :disabled="!editable"
      :class="{'selected': s_img_dropdown_open}"
      type="button"
      v-if="toolbars.imagelink"
      @mouseleave="$mouseleave_img_dropdown"
      @mouseenter="$mouseenter_img_dropdown"
      class="op-icon fa fa-halo-picture-o dropdown dropdown-wrapper"
      aria-hidden="true"
    >
      <transition name="fade">
        <div
          class="op-image popup-dropdown"
          :class="{'transition': transition}"
          v-show="s_img_dropdown_open"
          @mouseleave="$mouseleave_img_dropdown"
          @mouseenter="$mouseenter_img_dropdown"
        >
          <div
            class="dropdown-item"
            @click.stop="$toggle_imgLinkAdd('imagelink')"
          ><span>添加图片链接</span></div>
          <div
            class="dropdown-item"
            style="overflow: hidden"
          >
            <input
              type="file"
              accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
              @change="$imgAdd($event)"
              multiple="multiple"
            />上传图片
          </div>
        </div>
      </transition>
    </div>
    <button
      :disabled="!editable"
      type="button"
      v-if="toolbars.code"
      @click="$clicks('code')"
      class="op-icon fa fa-halo-code"
      aria-hidden="true"
      :title="`代码块 (Ctrl+Alt+C)`"
    ></button>
    <button
      :disabled="!editable"
      type="button"
      v-if="toolbars.table"
      @click="$clicks('table')"
      class="op-icon fa fa-halo-table"
      aria-hidden="true"
      :title="`表格 (Ctrl+Alt+T)`"
    ></button>
    <span
      v-if="toolbars.link || toolbars.imagelink || toolbars.code || toolbars.table"
      class="op-icon-divider"
    ></span>
    <button
      type="button"
      v-if="toolbars.undo"
      @click="$clicks('undo')"
      class="op-icon fa fa-halo-undo"
      aria-hidden="true"
      :title="`上一步 (Ctrl+Z)`"
    ></button>
    <button
      type="button"
      v-if="toolbars.redo"
      @click="$clicks('redo')"
      class="op-icon fa fa-halo-repeat"
      aria-hidden="true"
      :title="`下一步 (Ctrl+Y)`"
    ></button>
    <button
      type="button"
      v-if="toolbars.trash"
      @click="$clicks('trash')"
      class="op-icon fa fa-halo-trash-o"
      aria-hidden="true"
      :title="`清空 (Ctrl+BreakSpace)`"
    ></button>
    <button
      type="button"
      v-if="toolbars.save"
      @click="$clicks('save')"
      class="op-icon fa fa-halo-floppy-o"
      aria-hidden="true"
      :title="`保存 (Ctrl+S)`"
    ></button>
    <slot name="left-toolbar-after" />

    <!-- 添加image链接 -->
    <transition name="fade">
      <div
        class="add-image-link-wrapper"
        v-if="s_img_link_open"
      >
        <div class="add-image-link">
          <i
            @click.stop.prevent="s_img_link_open = false"
            class="fa fa-halo-times"
            aria-hidden="true"
          ></i>
          <h3 class="title">{{link_type == 'link' ? '添加链接' : '添加图片'}}</h3>
          <div class="link-text input-wrapper">
            <input
              ref="linkTextInput"
              type="text"
              v-model="link_text"
              :placeholder="link_type == 'link' ? '链接描述' : '图片描述'"
            >
          </div>
          <div class="link-addr input-wrapper">
            <input
              type="text"
              v-model="link_addr"
              :placeholder="link_type == 'link' ? '链接地址' : '图片链接'"
            >
          </div>
          <div
            class="op-btn cancel"
            @click.stop="s_img_link_open = false"
          >取消</div>
          <div
            class="op-btn sure"
            @click.stop="$imgLinkAdd()"
          >确定</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: "s-md-toolbar-left",
  props: {
    editable: {
      // 是否开启编辑
      type: Boolean,
      default: true
    },
    transition: {
      // TODO: 是否开启动画过渡
      type: Boolean,
      default: true
    },
    toolbars: {
      // 工具栏
      type: Object,
      required: true
    },
    image_filter: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      // [index, file]
      img_file: [[0, null]],
      img_timer: null,
      header_timer: null,
      s_img_dropdown_open: false,
      s_header_dropdown_open: false,
      s_img_link_open: false,
      trigger: null,
      num: 0,
      link_text: "",
      link_addr: "",
      link_type: "link"
    };
  },
  methods: {
    $imgLinkAdd() {
      this.$emit(
        "toolbar_left_addlink",
        this.link_type,
        this.link_text,
        this.link_addr
      );
      this.s_img_link_open = false;
    },
    $toggle_imgLinkAdd(type) {
      this.link_type = type;
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
      // this.img_file[0][0] = this.num;
      // this.img_file[0][1] = $file;
      // this.img_file.unshift([(this.num + 1), null]);
      // this.num = this.num + 1;
      this.img_file.push([++this.num, $file]);
      this.$emit("imgAdd", this.num, $file);
      this.s_img_dropdown_open = false;
    },
    $imgFilesAdd($files) {
      // valid means if the image_filter exist.
      let valid = typeof this.image_filter === "function";
      for (let i = 0; i < $files.length; i++) {
        if (valid && this.image_filter($files[i]) === true) {
          this.$imgFileAdd($files[i]);
        } else if (!valid && $files[i].type.match(/^image\//i)) {
          this.$imgFileAdd($files[i]);
        }
      }
    },
    $imgAdd($e) {
      this.$imgFilesAdd($e.target.files);
      $e.target.value = ""; // 初始化
    },
    // 工具栏功能图标click-----------------
    $mouseenter_img_dropdown() {
      if (this.editable) {
        clearTimeout(this.img_timer);
        this.s_img_dropdown_open = true;
      }
    },
    $mouseleave_img_dropdown() {
      let vm = this;
      this.img_timer = setTimeout(function() {
        vm.s_img_dropdown_open = false;
      }, 200);
    },
    $mouseenter_header_dropdown() {
      if (this.editable) {
        clearTimeout(this.header_timer);
        this.s_header_dropdown_open = true;
      }
    },
    $mouseleave_header_dropdown() {
      let vm = this;
      this.header_timer = setTimeout(function() {
        vm.s_header_dropdown_open = false;
      }, 200);
    },
    $clicks(_type) {
      // 让父节点来绑定事件并
      if (this.editable) {
        this.$emit("toolbar_left_click", _type);
      }
    },
    $click_header(_type) {
      // 让父节点来绑定事件并
      this.$emit("toolbar_left_click", _type);
      this.s_header_dropdown_open = false;
    },
    handleClose(e) {
      this.s_img_dropdown_open = false;
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
