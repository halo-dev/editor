<template>
  <div id="app">
    <div
        v-if="!screen_phone"
        class="item"
    >
      <halo-editor
          ref="md"
          :autofocus="autofocus"
          :boxShadow="true"
          :externalLink="external_link"
          :scrollStyle="true"
          :shortCut="true"
          :subfield="subfield"
          :toolbarsFlag="toolbarsFlag"
          :transition="true"
          box-shadow-style="0 2px 12px 0 rgba(0, 0, 0, 0.1)"
          class="item-editor"
          preview-background="#fbfbfb"
          toolbars-background="#ffffff"
          @change="change"
          @imgAdd="$imgAdd"
          @imgDel="$imgDel"
          @previewtoggle="$previewtoggle"
          @save="saveone"
          @subfieldtoggle="$subfieldtoggle"
      >
      </halo-editor>

      <button
          ref="diy"
          aria-hidden="true"
          class="op-icon fa fa-halo-align-left"
          title="自定义"
          type="button"
          @click="$click('selftest')"
      ></button>
    </div>
    <!--自定义-->
    <div
        v-if="screen_phone"
        class="item"
    >
      <h2 class="item-header">
      </h2>
      <halo-editor
          :toolbars="toolbars"
          class="item-editor"
          @save="savetwo"
      ></halo-editor>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {haloEditor} from "../index";

export default {
  name: "app",
  data() {
    return {
      screen_phone: false,
      toolbars: {
        underline: true, // 下划线
        strikethrough: true, // 中划线
        alignCenter: true, // 中划线
        undo: true,
        save: true,
        fullscreen: true, // 全屏编辑
        navigation: true,
        preview: true,
        subfield: false
      },
      autofocus: true,
      subfield: true,
      toolbarsFlag: true,
      img_file: {},
      external_link: {
        katex_css: function () {
          return "/katex/katex.min.css";
        },
        katex_js: function () {
          return "/katex/katex.min.js";
        }
      },
      toolbar_settings: {
        undo: true, // 上一步
        redo: true, // 下一步
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        code: true, // code
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
        /* 1.4.2 */
        navigation: true // 导航目录
      },
      imageClick: function (file) {
        console.log(file);
      },
      imgName: ""
    };
  },
  created() {
    var $vm = this;
    this.sizeToStatus();
    window.addEventListener("resize", function () {
      // 媒介查询
      $vm.sizeToStatus();
    });
  },
  mounted() {
    var md = this.$refs.md;
    var toolbar_left = md.$refs.toolbar_left;
    var diy = this.$refs.diy;
    toolbar_left.$el.append(diy);
    // toolbar_left.$el.append(diy.$el)
    // console.log(toolbar_left)
  },
  methods: {
    clearCache() {
      this.$refs.md.$emptyHistory();
    },
    $click(val) {
      console.log(val);
    },
    $imgAdd(pos, $file) {
      console.log("imgAdd", pos, $file);
      this.img_file[pos] = $file;
    },
    $imgDel(pos) {
      console.log("imgDel", pos);
      delete this.img_file[pos];
    },
    sizeToStatus() {
      this.screen_phone = !window.matchMedia("(min-width:768px)").matches;
    },
    saveone(val, render) {
      alert("save one");
    },
    savetwo(val, render) {
      alert("save two");
    },
    change(val, render) {
      console.log(val);
    },
    $subfieldtoggle(flag, value) {
      console.log("sufield toggle" + flag);
    },
    $previewtoggle(flag, value) {
      console.log("preview toggle" + flag);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
body {
  margin: 0;
  padding: 0;
  padding-bottom: 50px;
}

.page-lang {
  position: absolute;
  top: 15px;
  right: 2%;
}

.page-header {
  box-sizing: border-box;
  padding: 90px 15px;
  width: 100%;
  height: 380px;
  color: #fff;
  text-align: center;
  background-color: #159957;
  background-image: linear-gradient(120deg, #155799, #159957);

  @media only screen and (max-width: 958px) {
    height: 300px;
    padding: 60px 15px;
  }

  @media only screen and (max-width: 768px) {
    height: 370px;
    padding: 50px 15px;
  }

  .project-name {
    margin-top: 0;
    margin-bottom: 0.1rem;
    font-size: 2.25rem;

    @media only screen and (max-width: 768px) {
      font-size: 25px;
    }
  }

  .project-tagline {
    margin-bottom: 2rem;
    font-weight: normal;
    opacity: 0.7;

    @media only screen and (max-width: 768px) {
      font-size: 16px;
    }
  }

  .btn {
    padding: 0.6rem 0.9rem;
    font-size: 0.9rem;
    display: inline-block;
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.7);
    background-color: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    border-style: solid;
    border-width: 1px;
    border-radius: 0.3rem;
    transition: color 0.2s, background-color 0.2s, border-color 0.2s;
    text-decoration: none;
    margin-left: 20px;
    box-sizing: border-box;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      background-color: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }

    @media only screen and (max-width: 768px) {
      display: block;
      width: 90%;
      padding: 0.75rem;
      font-size: 0.9rem;
      margin-left: 5%;
    }
  }
}

.item {
  width: 75%;
  margin-left: 12.5%;

  @media only screen and (max-width: 1100px) {
    width: 85%;
    margin-left: 7.5%;
  }

  @media only screen and (max-width: 768px) {
    width: 92%;
    margin-left: 4%;
  }

  .item-header {
    margin-top: 3.5rem;
    margin-bottom: 2rem;
    font-weight: normal;
    color: #159957;

    @media only screen and (max-width: 768px) {
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
  }

  .item-button {
    margin-bottom: 4rem;
  }

  .item-editor {
    width: 100%;
    height: 700px;

    @media only screen and (max-width: 1600px) {
      height: 550px;
    }
  }
}
</style>
