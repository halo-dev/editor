<template>
  <div class="v-left-item">
    <button
      v-if="toolbars.bold"
      :title="`粗体 (${ctrlKeyName} + B)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('bold')"
    >
      <i-fa-bold />
    </button>
    <button
      v-if="toolbars.italic"
      :title="`斜体 (${ctrlKeyName} + I)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('italic')"
    >
      <i-fa-italic />
    </button>
    <div
      v-if="toolbars.header"
      :class="{ selected: s_header_dropdown_open }"
      :title="`标题 (${ctrlKeyName} + H)`"
      aria-hidden="true"
      class="op-icon dropdown dropdown-wrapper"
      type="button"
      @mouseenter="$mouseenter_header_dropdown"
      @mouseleave="$mouseleave_header_dropdown"
    >
      <i-fa-hashtag />
      <transition name="fade">
        <div
          v-show="s_header_dropdown_open"
          :class="{ transition: transition }"
          class="op-header popup-dropdown"
          @mouseenter="$mouseenter_header_dropdown"
          @mouseleave="$mouseleave_header_dropdown"
        >
          <div class="dropdown-item" title="#" @click.stop="$click_header('header', 1)"><span>一级标题</span></div>
          <div class="dropdown-item" title="## " @click.stop="$click_header('header', 2)"><span>二级标题</span></div>
          <div class="dropdown-item" title="### " @click.stop="$click_header('header', 3)"><span>三级标题</span></div>
          <div class="dropdown-item" title="#### " @click.stop="$click_header('header', 4)"><span>四级标题</span></div>
          <div class="dropdown-item" title="##### " @click.stop="$click_header('header', 5)"><span>五级标题</span></div>
          <div class="dropdown-item" title="###### " @click.stop="$click_header('header', 6)">
            <span>六级标题</span>
          </div>
        </div>
      </transition>
    </div>
    <span v-if="toolbars.header || toolbars.italic || toolbars.bold" class="op-icon-divider"></span>
    <button
      v-if="toolbars.underline"
      :title="`下划线 (${ctrlKeyName} + U)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('underline')"
    >
      <i-fa-underline />
    </button>
    <button
      v-if="toolbars.strikethrough"
      :title="`中划线 (${ctrlKeyName} + Shift + D)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('strikethrough')"
    >
      <i-fa-strikethrough />
    </button>
    <button
      v-if="toolbars.superscript"
      :title="`上角标 (${ctrlKeyName} + ${altKeyName} + S)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('superscript')"
    >
      <i-fa-superscript />
    </button>
    <button
      v-if="toolbars.subscript"
      :title="`下角标 (${ctrlKeyName} + ${altKeyName} + S)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('subscript')"
    >
      <i-fa-subscript />
    </button>
    <span
      v-if="toolbars.superscript || toolbars.subscript || toolbars.underline || toolbars.strikethrough"
      class="op-icon-divider"
    ></span>
    <button
      v-if="toolbars.quote"
      :title="`段落引用 (${ctrlKeyName} + Q)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('quote')"
    >
      <i-fa-quote-left />
    </button>
    <button
      v-if="toolbars.ol"
      :title="`有序列表 (${ctrlKeyName} + O)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('ol')"
    >
      <i-fa-list-ol />
    </button>
    <button
      v-if="toolbars.ul"
      :title="`无序列表 (${ctrlKeyName} + ${altKeyName} + U)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('ul')"
    >
      <i-fa-list-ul />
    </button>
    <span v-if="toolbars.ul || toolbars.ol || toolbars.quote" class="op-icon-divider"></span>
    <button
      v-if="toolbars.link"
      :title="`链接 (${ctrlKeyName} + L)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click.stop="handleOpenLinkAddModal('link')"
    >
      <i-fa-link />
    </button>
    <button
      v-if="toolbars.imagelink"
      :title="`选择图片 (${ctrlKeyName} + Shift + I)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click.stop="handleOpenImagePicker"
    >
      <i-fa-picture-o />
    </button>
    <button
      v-if="toolbars.code"
      :title="`代码块 (${ctrlKeyName} + ${altKeyName} + C)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('code')"
    >
      <i-fa-code />
    </button>
    <button
      v-if="toolbars.table"
      :title="`表格 (${ctrlKeyName} + ${altKeyName} + T)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('table')"
    >
      <i-fa-table />
    </button>
    <span v-if="toolbars.link || toolbars.imagelink || toolbars.code || toolbars.table" class="op-icon-divider"></span>
    <button
      v-if="toolbars.undo"
      :title="`上一步 (${ctrlKeyName} + Z)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('undo')"
    >
      <i-fa-undo />
    </button>
    <button
      v-if="toolbars.redo"
      :title="`下一步 (${ctrlKeyName} + Y)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('redo')"
    >
      <i-fa-repeat />
    </button>
    <button
      v-if="toolbars.save"
      :title="`保存 (${ctrlKeyName} + S)`"
      aria-hidden="true"
      class="op-icon"
      type="button"
      @click="$clicks('save')"
    >
      <i-fa-floppy-o />
    </button>

    <transition name="fade">
      <div v-if="s_link_open" class="add-image-link-wrapper">
        <div class="add-image-link">
          <i @click.stop.prevent="s_link_open = false">
            <i-fa-times height="1rem" width="1rem" />
          </i>
          <h3 class="title">添加链接</h3>
          <div class="link-text input-wrapper">
            <input ref="linkTextInput" v-model="link_text" placeholder="链接描述" type="text" />
          </div>
          <div class="link-addr input-wrapper">
            <input v-model="link_addr" placeholder="链接地址" type="text" />
          </div>
          <div class="op-btn cancel" @click.stop="s_link_open = false">取消</div>
          <div class="op-btn sure" @click.stop="handleAddLink()">确定</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 's-md-toolbar-left',
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
      header_timer: null,
      s_header_dropdown_open: false,
      s_link_open: false,
      trigger: null,
      num: 0,
      link_text: '',
      link_addr: ''
    }
  },
  computed: {
    ctrlKeyName() {
      return this.isMacPlatform ? 'Cmd' : 'Ctrl'
    },
    altKeyName() {
      return this.isMacPlatform ? 'Option' : 'Alt'
    },
    isMacPlatform() {
      return /Mac/.test(navigator.platform)
    }
  },
  methods: {
    handleOpenImagePicker() {
      this.$emit('openImagePicker')
    },
    handleAddLink() {
      this.$emit('insertLink', this.link_text, this.link_addr)
      this.s_link_open = false
    },
    handleOpenLinkAddModal() {
      this.link_text = this.link_addr = ''
      this.s_link_open = true
      this.$nextTick(() => {
        this.$refs.linkTextInput.focus()
      })
    },
    $mouseenter_header_dropdown() {
      clearTimeout(this.header_timer)
      this.s_header_dropdown_open = true
    },
    $mouseleave_header_dropdown() {
      let vm = this
      this.header_timer = setTimeout(function () {
        vm.s_header_dropdown_open = false
      }, 200)
    },
    $clicks(_type) {
      // 让父节点来绑定事件并
      this.$emit('clickCommands', _type)
    },
    $click_header(_type, level) {
      // 让父节点来绑定事件并
      this.$emit('clickCommands', _type, { level })
      this.s_header_dropdown_open = false
    }
  }
}
</script>
<style lang="stylus">
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
