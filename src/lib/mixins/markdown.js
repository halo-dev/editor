import escape from 'lodash.escape'
import mermaid from "mermaid";

const markdown_config = {
    html: true, // Enable HTML tags in source
    xhtmlOut: true, // Use '/' to close single tags (<br />).
    breaks: true, // Convert '\n' in paragraphs into <br>
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
    highlight(str, lang) {
        if (['mermaid', 'plantuml'].includes(lang)) {
            return `<pre class="${lang}"><code>${escape(str)}</code></pre>`
        } else {
            return `<pre><code class="language-${lang}">${escape(str)}</code></pre>`
        }
    }
};

const markdown = require('markdown-it')(markdown_config);
// 表情
const markdownItEmoji = require('markdown-it-emoji');
// 下标
const markdownItSub = require('markdown-it-sub');
// 上标
const markdownItSup = require('markdown-it-sup');
// <abbr/>
const markdownItAbbr = require('markdown-it-abbr');
// footnote
const markdownItFootnote = require('markdown-it-footnote');
// insert 带有下划线 样式 ++ ++
const markdownItIns = require('markdown-it-ins');
// taskLists
const markdownItTaskLists = require('markdown-it-task-lists');
const markdownItAnchor = require('markdown-it-anchor').default;
const markdownItTableOfContents = require('markdown-it-table-of-contents');
// add target="_blank" to all link
const defaultRender = markdown.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};
markdown.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const hIndex = tokens[idx].attrIndex('href');
    if (tokens[idx].attrs[hIndex][1].startsWith('#')) return defaultRender(tokens, idx, options, env, self);
    // If you are sure other plugins can't add `target` - drop check below
    const aIndex = tokens[idx].attrIndex('target');

    if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']); // add new attribute
    } else {
        tokens[idx].attrs[aIndex][1] = '_blank'; // replace value of existing attr
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
};
// math katex
const markdownItKatexExternal = require('markdown-it-katex-external');
const markdownItImagesPreview = require('markdown-it-images-preview');
markdown
    .use(markdownItEmoji)
    .use(markdownItSup)
    .use(markdownItSub)
    .use(markdownItAbbr)
    .use(markdownItFootnote)
    .use(markdownItIns)
    .use(markdownItImagesPreview)
    .use(markdownItKatexExternal)
    .use(markdownItTaskLists)
    .use(markdownItTableOfContents, {
        includeLevel: [1, 2, 3, 4, 5, 6],
        markerPattern: /^\[TOC\]/im
    })
    .use(markdownItAnchor)

export default {
    data() {
        return {
            markdownIt: markdown
        }
    },
    methods: {
        $render(src, func) {
            const res = markdown.render(src);
            func(res);
        },
        renderMermaidDiagrams() {
            const mermaids = document.querySelectorAll('.v-show-content pre.mermaid > code')
            if (!mermaids.length) {
                return
            }
            for (let i = 0; i < mermaids.length; i++) {
                const mermaidDef = mermaids[i].innerText
                const mmElm = document.createElement('div')
                mmElm.innerHTML = `<div id="mermaid-id-${i}">${mermaid.render(`mermaid-id-${i}`, mermaidDef)}</div>`
                mermaids[i].parentElement.replaceWith(mmElm)
            }
        }
    }
};
