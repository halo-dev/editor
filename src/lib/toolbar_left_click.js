/**
 * @Author: HuaChao Chen <CHC>
 * @Date:   2017-05-03T01:23:38+08:00
 * @Email:  chenhuachaoxyz@gmail.com
 * @Filename: toolbar_left_click.js
 * @Last modified by:   CHC
 * @Last modified time: 2017-08-10T12:43:22+08:00
 * @License: MIT
 * @Copyright: 2017
 */

function $toolbar_left_undo_click($vm) {
    if ($vm.d_history_index > 0) {
        $vm.d_history_index--
    }
    // $vm.$refs.vNoteDivEdit.innerHTML = $vm.s_markdown.render($vm.d_value)
    if ($vm.s_preview_switch) {
        let start = $vm.getTextareaDom().selectionStart
        let currentLength = $vm.d_value.length
        $vm.$nextTick(() => {
            // 光标操作
            start -= currentLength - $vm.d_value.length
            $vm.getTextareaDom().selectionStart = start
            $vm.getTextareaDom().selectionEnd = start
        })
    }
    $vm.getTextareaDom().focus()
}
// redo
function $toolbar_left_redo_click($vm) {
    if ($vm.d_history_index < $vm.d_history.length - 1) {
        $vm.d_history_index++
    }
    $vm.getTextareaDom().focus()
    // $vm.$refs.vNoteDivEdit.innerHTML = $vm.s_markdown.render($vm.d_value)
}
function $toolbar_left_trash_click($vm) {
    $vm.d_value = ''
    $vm.getTextareaDom().focus()
    // $vm.$refs.vNoteDivEdit.innerHTML = $vm.s_markdown.render($vm.d_value)
}
function $toolbar_left_save_click($vm) {
    $vm.save($vm.d_value, $vm.d_render)
}
// ol
function $toolbar_left_ol_click($vm) {
    $vm.insertOl()
}
// ul
function $toolbar_left_ul_click($vm) {
    $vm.insertUl()
}
function $toolbar_left_remove_line_click($vm) {
    $vm.removeLine()
}
// 直接添加链接
export const toolbar_left_addlink = (text, link, $vm) => {
    let insert_text = {
        prefix: `[${text}](`,
        subfix: ')',
        str: link
    };
    $vm.insertText($vm.getTextareaDom(), insert_text);
}
export const toolbar_left_click = (_type, $vm) => {
     var _param_of_insert_text = {
         'bold': {
             prefix: '**',
             subfix: '**',
             str: '粗体'
         },
         'italic': {
             prefix: '*',
             subfix: '*',
             str: '斜体'
         },
         'header': {
             prefix: '# ',
             subfix: '',
             str: '标题'
         },
         'header1': {
             prefix: '# ',
             subfix: '',
             str: '一级标题'
         },
         'header2': {
             prefix: '## ',
             subfix: '',
             str: '二级标题'
         },
         'header3': {
             prefix: '### ',
             subfix: '',
             str: '三级标题'
         },
         'header4': {
             prefix: '#### ',
             subfix: '',
             str: '四级标题'
         },
         'header5': {
             prefix: '##### ',
             subfix: '',
             str: '五级标题'
         },
         'header6': {
             prefix: '###### ',
             subfix: '',
             str: '六级标题'
         },
         'underline': {
             prefix: '++',
             subfix: '++',
             str: '下划线'
         },
         'strikethrough': {
             prefix: '~~',
             subfix: '~~',
             str: '中划线'
         },
         'superscript': {
             prefix: '^',
             subfix: '^',
             str: '上角标'
         },
         'subscript': {
             prefix: '~',
             subfix: '~',
             str: '下角标'
         },
         'quote': {
             prefix: '> ',
             subfix: '',
             str: '段落引用'
         },
         'link': {
             prefix: '[](',
             subfix: ')',
             str: '链接'
         },
         'imagelink': {
             prefix: '![](',
             subfix: ')',
             str: '添加图片链接'
         },
         'code': {
             prefix: '```',
             subfix: '\n\n```\n',
             str: 'language'
         },
         'table': {
             prefix: '',
             subfix: '',
             str: '|column1|column2|column3|\n|-------|-------|-------|\n|content1|content2|content3|\n'
         }
     };
     if (_param_of_insert_text.hasOwnProperty(_type)) {
         // 插入对应的内容
         $vm.insertText($vm.getTextareaDom(),
             _param_of_insert_text[_type]);
     }
     var _other_left_click = {
         'undo': $toolbar_left_undo_click,
         'redo': $toolbar_left_redo_click,
         'trash': $toolbar_left_trash_click,
         'save': $toolbar_left_save_click,
         'ol': $toolbar_left_ol_click,
         'ul': $toolbar_left_ul_click,
         'removeLine': $toolbar_left_remove_line_click
     };
     if (_other_left_click.hasOwnProperty(_type)) {
         _other_left_click[_type]($vm);
     }
 }
