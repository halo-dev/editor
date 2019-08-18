import { Component } from "vue";
interface VueHaloEditor {
  markdownIt: any;
  haloEditor: Component;
  LeftToolbar: Component;
  RightToolbar: Component;
  install: (Vue: any) => any;
}
declare let editor: VueHaloEditor;
export default editor;
