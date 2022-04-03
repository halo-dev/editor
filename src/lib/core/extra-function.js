/**
 * @Author: HuaChao Chen <chc>
 * @Date:   2017-06-14T23:04:34+08:00
 * @Email:  chenhuachaoxyz@gmail.com
 * @Filename: extra-function.js
 * @Last modified by:   CHC
 * @Last modified time: 2017-12-19T17:46:48+08:00
 * @License: MIT
 * @Copyright: 2017
 */

/**
 * 生成导航目录
 */
export const getNavigation = $vm => {
  let navigationContent

  navigationContent = $vm.$refs.navigationContent

  navigationContent.innerHTML = $vm.d_render
  let nodes = navigationContent.children
  if (nodes.length) {
    for (let i = 0; i < nodes.length; i++) {
      judageH(nodes[i], i, nodes)
    }
  }

  function judageH(node, i) {
    let reg = /^H[1-6]{1}$/
    if (!reg.exec(node.tagName)) {
      node.style.display = 'none'
    } else {
      node.onclick = function () {
        const vShowContent = $vm.$refs.vShowContent
        if ($vm.s_preview_switch && vShowContent) {
          vShowContent.scrollTop = vShowContent.children[i].offsetTop
        }
      }
    }
  }
}

/**
 * 监听浏览器fullscreen
 * @param $vm
 */
export const fullscreenchange = $vm => {
  // 阅读模式 全屏监听事件
  $vm.$el.addEventListener(
    'fullscreenchange',
    function () {
      $vm.$toolbar_right_read_change_status()
    },
    false
  )
  $vm.$el.addEventListener(
    'mozfullscreenchange',
    function () {
      $vm.$toolbar_right_read_change_status()
    },
    false
  )
  $vm.$el.addEventListener(
    'webkitfullscreenchange',
    function () {
      $vm.$toolbar_right_read_change_status()
    },
    false
  )
  $vm.$el.addEventListener(
    'msfullscreenchange',
    function () {
      $vm.$toolbar_right_read_change_status()
    },
    false
  )
}

export const ImagePreviewListener = $vm => {
  // vShowContent
  $vm.$refs.vShowContent.addEventListener('click', function (event) {
    event = event ? event : window.event
    let ele = event.srcElement ? event.srcElement : event.target
    if (ele.tagName === 'IMG') {
      if ($vm.imageClick != null) {
        // 覆盖图片点击事件
        $vm.imageClick(ele)
      } else {
        $vm.d_preview_imgsrc = ele.src
      }
    }
  })
}
