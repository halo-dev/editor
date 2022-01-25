import hljsLangs from '../core/hljs/lang.hljs.js'
import {
    loadScript
} from '../core/extra-function.js'

const markdown_config = {
    html: true, // Enable HTML tags in source
    xhtmlOut: true, // Use '/' to close single tags (<br />).
    breaks: true, // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-', // CSS language prefix for fenced blocks. Can be
    linkify: true, // 自动识别url
    typographer: true,
    quotes: '“”‘’'
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
// const markdownItMermaidPlus = require('markdown-it-mermaid-plus').default;
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
const markdownItHighlightJSExternal = require('markdown-it-highlightjs-external');
// math katex
const markdownItKatexExternal = require('markdown-it-katex-external');
const markdownItImagesPreview = require('markdown-it-images-preview');
let missLangs = {};
let needLangs = [];
const hljs_opts = {
    hljs: 'auto',
    highlighted: true,
    langCheck: function (lang) {
        if (lang && hljsLangs[lang] && !missLangs[lang]) {
            missLangs[lang] = 1;
            needLangs.push(hljsLangs[lang])
        }
    }
};
markdown.use(markdownItHighlightJSExternal, hljs_opts)
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
    // .use(markdownItMermaidPlus)

export default {
    data() {
        return {
            markdownIt: markdown
        }
    },
    mounted() {
        const $vm = this;
        hljs_opts.highlighted = this.ishljs;
    },
    methods: {
        $render(src, func) {
            const $vm = this;
            missLangs = {};
            needLangs = [];
            const res = markdown.render(src);
            if (this.ishljs) {
                if (needLangs.length > 0) {
                    $vm.$_render(src, func, res);
                }
            }
            func(res);
        },
        $_render(src, func, res) {
            const $vm = this;
            let deal = 0;
            for (let i = 0; i < needLangs.length; i++) {
                const url = $vm.p_external_link.hljs_lang(needLangs[i]);
                loadScript(url, function () {
                    deal = deal + 1;
                    if (deal === needLangs.length) {
                        res = markdown.render(src);
                        func(res);
                    }
                })
            }
        }
    },
    watch: {
        ishljs: function (val) {
            hljs_opts.highlighted = val;
        }
    }
};
