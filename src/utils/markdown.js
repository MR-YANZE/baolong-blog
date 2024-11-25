import { marked } from 'marked'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'

// 导入所有可能用到的主题
import 'highlight.js/styles/atom-one-dark.css'
import 'highlight.js/styles/atom-one-light.css'

// 语言显示的映射
const languageMap = {
    'js': 'JavaScript',
    'javascript': 'JavaScript',
    'ts': 'TypeScript',
    'typescript': 'TypeScript',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'sql': 'SQL',
    'bash': 'Bash',
    'shell': 'Shell',
    'python': 'Python',
    'java': 'Java',
    'json': 'JSON',
    'vue': 'Vue',
    'jsx': 'JSX',
    'tsx': 'TSX',
    'xml': 'XML',
    'yaml': 'YAML',
    'md': 'Markdown',
    'dockerfile': 'Dockerfile'
}

// 配置 marked
const renderer = new marked.Renderer()

// 重写代码块渲染
renderer.code = function (code, language) {
    console.log('Code:', code)
    console.log('Language:', language)
    // 如果 code 是对象，使用其 text 属性
    const codeText = typeof code === 'object' ? code.text : code
    // 如果 code 是对象，优先使用其 lang 属性
    const lang = (typeof code === 'object' ? code.lang : language) || 'Plain Text'
    const displayLang = languageMap[lang.toLowerCase()] || lang || 'Plain Text'
    // 如果代码超过15行，添加折叠功能
    const lines = codeText.split('\n')
    const isLongCode = lines.length > 15

    // 处理代码高亮
    let highlightedCode = codeText
    try {
        if (lang && lang !== 'Plain Text' && hljs.getLanguage(lang)) {
            highlightedCode = hljs.highlight(codeText, {
                language: lang,
                ignoreIllegals: true
            }).value
        } else {
            // 如果没有指定语言或语言不支持，尝试自动检测
            highlightedCode = hljs.highlightAuto(codeText).value
        }
    } catch (err) {
        console.error('代码高亮失败:', err)
        highlightedCode = codeText
    }

    return `
        <div class="code-block ${isLongCode ? 'expandable' : ''}" onclick="event.stopPropagation(); copyCodeBlock(this)" data-expanded="true">
            <div class="code-header">
                <div class="code-header-left">
                    <span class="code-lang">${displayLang}</span>
                    ${isLongCode ? `<span class="line-numbers">共 ${lines.length} 行</span>` : ''}
                </div>
                <div class="code-header-right">
                    ${isLongCode ? `
                        <span class="expand-btn" onclick="event.stopPropagation(); toggleCodeBlock(this)">
                            <svg class="expand-icon" viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                            </svg>
                            <span class="expand-text">展开代码</span>
                        </span>
                    ` : ''}
                    <span class="copy-tip">
                        点击复制代码
                        <svg viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                    </span>
                </div>
            </div>
            <div class="code-content">
                <pre><code class="hljs ${lang ? `language-${lang}` : ''}">${highlightedCode}</code></pre>
            </div>
        </div>
    `
}

// 配置 marked 选项
marked.setOptions({
    renderer: renderer,
    highlight: function (code, language) {
        if (language && hljs.getLanguage(language)) {
            try {
                console.log("代码 " + code)
                console.log("语言： " + lang)
                return hljs.highlight(code, {
                    language: language
                }).value
            } catch (err) {
                console.error('代码高亮失败:', err)
                return hljs.highlightAuto(code).value
            }
        }
        return code
    },
    langPrefix: 'hljs language-',
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
})

// 配置 DOMPurify
const config = {
    ADD_TAGS: ['button', 'el-button', 'span', 'div', 'svg', 'path'],
    ADD_ATTR: ['class', 'size', 'onclick', 'style', 'viewBox', 'width', 'height', 'fill', 'data-expanded'],
}

// 解析 Markdown
export function parseMarkdown(content) {
    if (!content) return ''
    return DOMPurify.sanitize(marked(content), config)
}

// 从 Markdown 内容中提取目录
export function extractToc(content) {
    if (!content) return []

    const headings = []
    const tokens = marked.lexer(content)
    let counter = 0

    tokens.forEach(token => {
        if (token.type === 'heading' && token.depth <= 3) {
            counter++
            headings.push({
                id: `section-${counter}`,
                text: token.text,
                level: token.depth
            })
        }
    })

    return headings
}

// 创建一个样式元素来控制主题切换
let styleElement = null
// 导出更新代码主题的函数
export function updateCodeTheme(isDark) {
    if (!styleElement) {
        styleElement = document.createElement('style')
        document.head.appendChild(styleElement)
    }

    // 禁用所有主题
    document.querySelectorAll('link[href*="highlight.js/styles"]').forEach(link => {
        link.disabled = true
    })

    // 启用对应主题
    const themeLink = document.querySelector(`link[href*="highlight.js/styles/atom-one-${isDark ? 'dark' : 'light'}.css"]`)
    if (themeLink) {
        themeLink.disabled = false
    }

    // 更新代码块样式
    styleElement.textContent = `
        .code-block {
            position: relative;
            margin: 1em 0;
            border-radius: 6px;
            overflow: hidden;
            background-color: ${isDark ? '#282c34' : '#fafafa'} !important;
        }

        /* 代码块头部 */
        .code-block .code-header {
            padding: 8px 16px;
            background: ${isDark ? '#21252b' : '#f1f1f1'} !important;
            border-bottom: 1px solid ${isDark ? '#3e4451' : '#e1e4e8'} !important;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* 代码内容区域 */
        .code-block .code-content {
            position: relative;
            transition: max-height 0.3s ease-in-out;
        }

        /* 折叠状态 */
        .code-block.expandable[data-expanded="false"] .code-content {
            max-height: 150px;
            overflow: hidden;
        }

        /* 展开状态 */
        .code-block.expandable[data-expanded="true"] .code-content {
            max-height: none;
        }

        /* 渐变遮罩 */
        .code-block.expandable[data-expanded="false"] .code-content::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 80px;
            background: linear-gradient(
                to bottom,
                ${isDark ? 'rgba(40, 44, 52, 0)' : 'rgba(250, 250, 250, 0)'} 0%,
                ${isDark ? 'rgba(40, 44, 52, 0.8)' : 'rgba(250, 250, 250, 0.8)'} 50%,
                ${isDark ? 'rgba(40, 44, 52, 1)' : 'rgba(250, 250, 250, 1)'} 100%
            );
            pointer-events: none;
        }

        .code-block {
            background-color: ${isDark ? '#282c34' : '#fafafa'} !important;
        }
        .code-block .code-header {
            background: ${isDark ? '#21252b' : '#f1f1f1'} !important;
            border-bottom: 1px solid ${isDark ? '#3e4451' : '#e1e4e8'} !important;
        }
        .code-block .code-lang {
            color: ${isDark ? '#abb2bf' : '#24292e'} !important;
            background: ${isDark ? '#3e4451' : '#e1e4e8'} !important;
        }
        .code-block .copy-tip {
            color: ${isDark ? '#abb2bf' : '#24292e'} !important;
        }
        .code-block .code-content pre {
            margin: 0;
            padding: 16px;
            background: ${isDark ? '#282c34' : '#fafafa'} !important;
        }

        .code-block.expandable .code-pre {
            max-height: 300px;
            overflow: hidden;
            transition: max-height 0.3s ease-in-out;
        }

        .code-block.expandable.expanded .code-pre {
            max-height: none;
        }

        .code-block .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .code-block .code-header-left,
        .code-block .code-header-right {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .code-block .line-numbers {
            font-size: 12px;
            color: ${isDark ? '#abb2bf' : '#6e7781'};
        }

        .code-block .expand-btn {
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            font-size: 12px;
            color: ${isDark ? '#abb2bf' : '#6e7781'};
            transition: color 0.2s;
        }

        .code-block .expand-btn:hover {
            color: ${isDark ? '#fff' : '#000'};
        }

        .code-block .expand-icon {
            transition: transform 0.3s;
        }

        /* 代码样式 */
        .hljs {
            background: transparent;
            color: ${isDark ? '#c0cbe0' : '#486491'} !important;
        }
        /* 注释 */
        .hljs .hljs-comment {
            color: ${isDark ? '#5c6370' : '#9a9b9c'} !important;
            font-style: italic;
        }
        /* 文档标签 */
        .hljs .hljs-doctag {
            color: ${isDark ? '#5c6370' : '#9a9b9c'} !important;
            font-style: italic;
        }
        /* 关键字 */
        .hljs .hljs-keyword {
            color: ${isDark ? '#c678dd' : '#c678dd'} !important;
        }
        /* 类型 */
        .hljs .hljs-type {
            color: ${isDark ? '#fffc42' : '#8729f3'} !important;
        }
        /* 变量 */
        .hljs .hljs-variable {
            color: ${isDark ? '#e06c75' : '#e06c75'} !important;
        }
        /* 字符串 */
        .hljs .hljs-string {
            color: ${isDark ? '#98c379' : '#98c379'} !important;
        }
        /* 数字 */
        .hljs .hljs-number {
            color: ${isDark ? '#d19a66' : '#d19a66'} !important;
        }
        /* 属性 */
        .hljs .hljs-property {
            color: ${isDark ? '#e06c75' : '#e06c75'} !important;
        }
        /* 属性名 */
        .hljs .hljs-attr {
            color: ${isDark ? '#d19a66' : '#abb2bf'} !important;
        }
        /* 类名 */
        .hljs .hljs-title.class_ {
            color: ${isDark ? '#e5c07b' : '#e5c07b'} !important;
        }
        /* 标签 */
        .hljs .hljs-tag {
            color: ${isDark ? '#e06c75' : '#e06c75'} !important;
        }
        /* 函数-名称 */
        .hljs .hljs-title {
            color: ${isDark ? '#61afef' : '#61afef'} !important;
        }
        /* 函数-参数 */
        .hljs .hljs-params {
            color: ${isDark ? '#ffa657' : '#ffa657'} !important;
        }
    `
}

// 初始化全局函数
export function initMarkdownHelpers() {
    // 添加全局代码复制函数
    window.copyCodeBlock = function (button) {
        const codeBlock = button.closest('.code-block')
        const code = codeBlock.querySelector('code').textContent

        navigator.clipboard.writeText(code).then(() => {
            window.$message.success('复制成功')
        }).catch(err => {
            console.error('复制失败:', err)
        })
        // 阻止事件冒泡
        event.stopPropagation()
    }

    // 添加全局代码折叠函数
    window.toggleCodeBlock = function (button) {
        const codeBlock = button.closest('.code-block')
        const isExpanded = codeBlock.getAttribute('data-expanded') === 'true'
        const expandText = button.querySelector('.expand-text')
        const expandIcon = button.querySelector('.expand-icon')

        // 切换展开状态
        codeBlock.setAttribute('data-expanded', !isExpanded)
        // 更新按钮文本和图标
        expandText.textContent = isExpanded ? '展开代码' : '收起代码'
        expandIcon.style.transform = isExpanded ? 'rotate(0)' : 'rotate(180deg)'
        // 阻止事件冒泡
        event.stopPropagation()
    }
}