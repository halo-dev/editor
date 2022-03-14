import { markdownIt as markdown } from '@halo-dev/markdown-renderer'

import hljs from '../core/hljs'

// add target="_blank" to all link
const defaultRender =
  markdown.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

markdown.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const hIndex = tokens[idx].attrIndex('href')
  if (tokens[idx].attrs[hIndex][1].startsWith('#')) return defaultRender(tokens, idx, options, env, self)
  // If you are sure other plugins can't add `target` - drop check below
  const aIndex = tokens[idx].attrIndex('target')

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']) // add new attribute
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank' // replace value of existing attr
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self)
}

export default {
  data() {
    return {
      markdownIt: markdown
    }
  },
  methods: {
    $render(src, func) {
      const res = markdown.render(src)
      func(res)
    },
    renderHighlight() {
      document.querySelectorAll('pre code').forEach(el => {
        hljs.highlightElement(el)
      })
    }
  }
}
