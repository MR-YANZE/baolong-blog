<template>
    <!-- 添加阅读进度条 -->
    <div class="reading-progress" :style="{ width: readingProgress + '%' }"></div>

    <div class="article-detail container">
        <el-row :gutter="20">
            <!-- 左侧文章内容 -->
            <el-col :lg="18" :md="24">
                <el-card class="main-content" :body-style="{ padding: '20px' }">
                    <!-- 文章头部信息 -->
                    <div class="article-header">
                        <h1 class="title">{{ article.title }}</h1>
                        <div class="meta">
                            <span class="time">
                                <el-icon>
                                    <Calendar />
                                </el-icon>
                                {{ article.createTime }}
                            </span>
                            <!-- 添加预计阅读时间 -->
                            <span class="read-time">
                                <el-icon>
                                    <Timer />
                                </el-icon>
                                预计 {{ calculateReadTime }} 分钟
                            </span>
                            <span class="views">
                                <el-icon>
                                    <View />
                                </el-icon>
                                {{ article.views }} 阅读
                            </span>
                            <span class="comments">
                                <el-icon>
                                    <ChatLineRound />
                                </el-icon>
                                {{ article.comments }} 评论
                            </span>
                        </div>
                        <div class="tags">
                            <el-tag v-for="tag in article.tags" :key="tag" size="small" class="tag">
                                {{ tag }}
                            </el-tag>
                        </div>
                    </div>

                    <!-- 文章内容 -->
                    <div class="article-content markdown-body" v-html="parsedContent"
                        :style="{ fontSize: `${fontSize}px` }">
                    </div>
                </el-card>

                <!-- 添加文章导航 -->
                <el-card class="article-nav">
                    <div class="nav-links">
                        <div class="prev-article" v-if="prevArticle" @click="navigateToArticle(prevArticle.id)">
                            <div class="nav-item">
                                <el-icon>
                                    <ArrowLeft />
                                </el-icon>
                                <div class="nav-info">
                                    <div class="nav-label">上一篇</div>
                                    <div class="nav-title">{{ prevArticle.title }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="next-article" v-if="nextArticle" @click="navigateToArticle(nextArticle.id)">
                            <div class="nav-item">
                                <div class="nav-info">
                                    <div class="nav-label">下一篇</div>
                                    <div class="nav-title">{{ nextArticle.title }}</div>
                                </div>
                                <el-icon>
                                    <ArrowRight />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </el-card>

                <!-- 评论区 -->
                <div class="comments-section">
                    <comment-section />
                </div>
            </el-col>

            <!-- 右侧边栏卡片 -->
            <el-col :lg="6" :md="24">
                <div class="toc-wrapper">
                    <!-- 字体大小控制卡片 -->
                    <el-card class="font-control-card" :body-style="{ padding: '12px' }">
                        <div class="font-control">
                            <span class="label">正文字体大小</span>
                            <el-button-group>
                                <el-button :icon="Minus" @click="decreaseFontSize" />
                                <el-button>{{ fontSize }}px</el-button>
                                <el-button :icon="Plus" @click="increaseFontSize" />
                            </el-button-group>
                        </div>
                    </el-card>

                    <!-- 目录卡片 -->
                    <el-card class="toc-card" v-if="tocItems.length > 0">
                        <template #header>
                            <div class="card-header" @click="toggleToc">
                                <span>目录</span>
                                <el-button type="text" :icon="isTocCollapsed ? ArrowUp : ArrowDown" />
                            </div>
                        </template>
                        <div class="toc-content" :class="{ 'collapsed': isTocCollapsed }">
                            <div v-for="item in tocItems" :key="item.id" class="toc-item" :class="[
                                `level-${item.level}`,
                                { active: currentHeading === item.id }
                            ]" @click="scrollToHeading(item.id)">
                                {{ item.text }}
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElCollapseTransition, ElMessage } from 'element-plus'
import { Calendar, View, Search, ArrowDown, ArrowUp, ArrowLeft, ArrowRight, Plus, Minus, ChatLineRound, Document } from '@element-plus/icons-vue'
import CommentSection from '@/components/comment/CommentSection.vue'
import { parseMarkdown, extractToc } from '@/utils/markdown.js'
import { useDebounce } from '@/composables/useDebounce'
import 'highlight.js/styles/github-dark.css'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

const router = useRouter()

// 阅读进度状态
const readingProgress = ref(0)
// 计算阅读进度
const calculateReadingProgress = () => {
    const element = document.documentElement
    const totalHeight = element.scrollHeight - element.clientHeight
    const progress = (element.scrollTop / totalHeight) * 100
    readingProgress.value = Math.min(100, Math.max(0, progress))
}
// 计算预计阅读时间
const calculateReadTime = computed(() => {
    // 移除 HTML 标签，只保留纯文本
    const cleanText = article.value.content.replace(/<[^>]*>/g, '')

    // 中文字符计数
    const chineseCharCount = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length

    // 英文单词计数（简单处理）
    const englishWordCount = cleanText.split(/\s+/).filter(word =>
        word.match(/[a-zA-Z]+/)
    ).length

    // 中文阅读速度：每分钟 300 字
    // 英文阅读速度：每分钟 200 词
    const readingTime = Math.ceil(
        (chineseCharCount / 300) + (englishWordCount / 200)
    )

    // 如果阅读时间小于 1 分钟，显示 1 分钟
    return Math.max(1, readingTime)
})

// 字体大小控制
const fontSize = ref(16)
const MIN_FONT_SIZE = 12
const MAX_FONT_SIZE = 24
// 增大字体大小
const increaseFontSize = () => {
    if (fontSize.value < MAX_FONT_SIZE) {
        fontSize.value += 2
    }
}
// 减小字体大小
const decreaseFontSize = () => {
    if (fontSize.value > MIN_FONT_SIZE) {
        fontSize.value -= 2
    }
}

// 文章数据
const article = ref({
    id: 1,
    title: 'Vue 3 组合式 API 最佳实践',
    createTime: '2024-01-15',
    views: 1234,
    comments: 56,
    tags: ['Vue', 'JavaScript', '前端开发'],
    content: `# Vue 3 组合式 API 最佳实践

## 引言

Vue 3 的组合式 API 为我们提供了更好的代码组织方式。本文将介绍一些最佳实践。

## 示例图片

![示例图片](https://picsum.photos/seed/2/800/400)

## 为什么使用组合式 API？

组合式 API 解决了以下问题：

1. 更好的代码组织
2. 更好的类型推导
3. 更好的代码复用

### 代码示例

\`\`\`javascript
const test = "Hello World";
console.log(test);
\`\`\`

## 最佳实践

### 使用 ref 和 reactive

在选择 \`ref\` 和 \`reactive\` 时，可以遵循以下原则：

- 使用 \`ref\` 存储单一值
- 使用 \`reactive\` 存储对象

### 代码示例

\`\`\`java
package com.xihe.pfc.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.Date;

/**
 * 客户/机构联系表
 *
 * @author Baolong 2024年06月21 10:28
 * @version 1.0
 * @since 1.8
 */
@Data
@Accessors(chain = true)
@TableName("pfc_customer_contact")
public class PfcCustomerContact implements Serializable {
	private static final long serialVersionUID = 1L;

	@TableId(value = "id", type = IdType.AUTO)
	private Long contactId;
	/**
	 * 客户/机构ID
	 */
	private Long customerId;
	/**
	 * 联系人姓名【备注：机构负责人】
	 */
	private String contactPersonName;

	/**
	 * 联系人部门
	 */
	private String contactPersonDept;
	/**
	 * 创建时间【建档时间】
	 */
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date createTime;
	/**
	 * 更新人
	 */
	private String updateBy;
	/**
	 * 更新时间
	 */
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date updateTime;
}

package com.xihe.testPackage.test01;

/**
 * @author Baolong 2024年11月20 15:21
 * @version 1.0
 * @since 1.8
 */
public abstract class ProAb {
	public static abstract class Pro {
		public Integer uid = 1000;
		public String name = "张三";

		public Pro(Integer uid, String name) {
			this.uid = uid;
			this.name = name;
		}
	}

	private Pro pro;

	//public ProAb() {
	//}
	public ProAb(Pro pro) {
		this.pro = pro;
	}

	public void show() {
		System.out.println(pro.uid);
	}

	public abstract void show2();
}



\`\`\`

## 注意事项

1. 避免过度使用组合式 API
2. 保持组件的简单性
3. 合理拆分组件

> 提示：组合式 API 不是银弹，选择合适的场景使用。

## 总结

组合式 API 是一个强大的工具，但需要合理使用。`
})
// 解析后的文章内容
const parsedContent = computed(() => parseMarkdown(article.value.content))

// 上一页文章数据
const prevArticle = ref({
    id: 2,
    title: 'Vue Router 实战技巧'
})
// 下一页文章数据
const nextArticle = ref({
    id: 4,
    title: 'Vuex 状态管理详解'
})
// 底部文章导航
const navigateToArticle = (id) => {
    router.push(`/article/${id}`)
}

// 提取目录
const tocItems = computed(() => extractToc(article.value.content))
// 目录展开/收起状态
const isTocCollapsed = ref(false)
// 切换目录展开/收起
const toggleToc = () => {
    isTocCollapsed.value = !isTocCollapsed.value
}

// 当前标题
const currentHeading = ref('')
// 在内容渲染后添加 ID
const addHeadingIds = () => {
    const headings = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3')
    tocItems.value.forEach((item, index) => {
        if (headings[index]) {
            headings[index].id = item.id
        }
    })
}
// 滚动到指定标题
const scrollToHeading = (id) => {
    const element = document.getElementById(id)
    if (element) {
        const offset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        })
        currentHeading.value = id
    }
}

// 监听滚动事件：右侧栏下滑
const handleRightTopScroll = () => {
    const tocWrapper = document.querySelector('.toc-wrapper')
    const footer = document.querySelector('.nav-footer')
    const mainContent = document.querySelector('.main-content')

    if (!tocWrapper || !footer || !mainContent) return

    const footerRect = footer.getBoundingClientRect()
    const mainRect = mainContent.getBoundingClientRect()
    const tocRect = tocWrapper.getBoundingClientRect()
    const windowHeight = window.innerHeight

    // 计算页脚到视口顶部的距离
    if (footerRect.top < windowHeight) {
        // 计算右侧栏应该移动的距离
        const maxScroll = mainRect.bottom - tocRect.height - 80 // 80px 是顶部间距
        const currentScroll = window.scrollY
        const finalPosition = Math.min(maxScroll - currentScroll, 0)

        tocWrapper.style.transform = `translateY(${finalPosition}px)`
    } else {
        tocWrapper.style.transform = 'none'
    }
}

onMounted(() => {
    addHeadingIds()

    // 监听滚动事件：右侧栏下滑
    window.addEventListener('scroll', handleRightTopScroll)
    handleRightTopScroll()

    // 监听滚动事件：阅读进度条
    window.addEventListener('scroll', calculateReadingProgress)
    calculateReadingProgress()

    // 图片查看器
    const gallery = document.querySelector('.article-content')
    new Viewer(gallery, {
        toolbar: true,
        navbar: false,
        title: false,
        movable: false,
        zoomable: true,
        rotatable: false,
        scalable: false,
        transition: true,
        fullscreen: true,
    })
})

onUnmounted(() => {
    // 移除监听事件：右侧栏下滑
    window.removeEventListener('scroll', handleRightTopScroll)

    // 移除监听事件：阅读进度条
    window.removeEventListener('scroll', calculateReadingProgress)
})
</script>

<style lang="scss" scoped>
// 添加进度条样式
.reading-progress {
    position: fixed;
    top: 60px; // 导航栏高度
    left: 0;
    height: 2px;
    background-color: var(--el-color-primary);
    transition: width 0.2s;
    z-index: 1000;
}

.article-detail {
    padding: 20px 0;
    position: relative;

    // 文章内容卡片
    .main-content {
        margin-bottom: 20px;

        .article-header {
            margin-bottom: 24px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--el-border-color-lighter);

            .title {
                font-size: 2em;
                margin-bottom: 16px;
            }

            .meta {
                display: flex;
                gap: 16px;
                color: var(--el-text-color-secondary);
                margin-bottom: 16px;
                font-size: 14px;

                span {
                    display: flex;
                    align-items: center;
                    gap: 4px;

                    .el-icon {
                        font-size: 16px;
                    }
                }

                .read-time {
                    .el-icon {
                        font-size: 16px;
                    }
                }
            }

            .tags {
                margin-bottom: 16px;

                .tag {
                    margin-right: 8px;
                }
            }
        }

        .article-content {
            font-size: 16px;
            line-height: 1.8;
            color: var(--el-text-color-primary);
        }

        .article-content img {
            max-width: 100%;
            cursor: pointer;
        }
    }

    // 右侧边栏卡片
    .toc-wrapper {
        position: fixed;
        width: inherit;
        max-width: inherit;
        transition: transform 0.5s ease;

        // 字体控制卡片样式
        .font-control-card {
            margin-bottom: 16px;

            .font-control {
                display: flex;
                flex-direction: column;
                gap: 8px;

                .label {
                    font-size: 14px;
                    color: var(--el-text-color-regular);
                    font-weight: bold;
                }

                .el-button-group {
                    display: flex;
                    width: 100%;

                    .el-button {
                        flex: 1;
                        padding: 8px;
                    }
                }
            }
        }

        // 目录卡片样式
        .toc-card {
            width: 100%;
            max-height: calc(100vh - 120px);
            overflow-y: auto;

            .card-header {
                font-weight: bold;
                font-size: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .toc-content {
                padding: 0;
                transition: max-height 0.3s ease-in-out;
                max-height: 500px;
                overflow: hidden;

                &.collapsed {
                    max-height: 0;
                }

                .toc-item {
                    padding: 8px 12px;
                    cursor: pointer;
                    color: var(--text-color);
                    transition: all 0.3s;
                    border-radius: 4px;
                    margin-bottom: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;

                    &:hover {
                        color: var(--el-color-primary);
                        background-color: var(--el-fill-color-light);
                    }

                    &.active {
                        color: var(--el-color-primary);
                        background-color: var(--el-fill-color-light);
                        font-weight: 500;
                    }

                    &.level-1 {
                        font-size: 15px;
                    }

                    &.level-2 {
                        padding-left: 24px;
                        font-size: 14px;
                    }

                    &.level-3 {
                        padding-left: 36px;
                        font-size: 13px;
                        color: var(--text-secondary);
                    }
                }
            }

            &::-webkit-scrollbar {
                width: 4px;
            }

            &::-webkit-scrollbar-thumb {
                background: var(--el-border-color-lighter);
                border-radius: 2px;
            }

            &::-webkit-scrollbar-track {
                background: transparent;
            }
        }
    }

}

// 文章下方导航
.article-nav {
    margin: 20px 0;

    .nav-links {
        display: flex;
        justify-content: space-between;

        .prev-article,
        .next-article {
            flex: 1;
            cursor: pointer;
            padding: 12px;
            transition: all 0.3s;

            &:hover {
                background-color: var(--el-fill-color-light);

                .nav-title {
                    color: var(--el-color-primary);
                }
            }

            .nav-item {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .nav-info {
                flex: 1;
                min-width: 0; // 防止文本溢出
            }

            .nav-label {
                color: var(--el-text-color-secondary);
                font-size: 14px;
                margin-bottom: 4px;
            }

            .nav-title {
                color: var(--el-text-color-primary);
                font-size: 16px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                transition: color 0.3s;
            }
        }

        .next-article {
            text-align: right;

            .nav-item {
                justify-content: flex-end;
            }
        }
    }
}

// 响应式处理
@media screen and (max-width: 992px) {
    .toc-wrapper {
        display: none;
    }
}
</style>

<!-- 代码块样式 -->
<style lang="scss">
.markdown-body {
    .code-block {
        position: relative;
        margin: 16px 0;
        background-color: #282c34;
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.3s;

        &:hover {
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

            .copy-tip {
                opacity: 1 !important;
                color: #5c6370;
            }
        }

        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 16px;
            background: #21252b;
            border-bottom: 1px solid #3e4451;

            .code-lang {
                font-size: 12px;
                color: #abb2bf;
                font-family: var(--el-font-family-monospace);
                background: #3e4451;
                padding: 2px 6px;
                border-radius: 3px;
            }

            .copy-tip {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 12px;
                color: #abb2bf;
                opacity: 0;
                transition: opacity 0.3s;

                svg {
                    margin-left: 4px;
                }
            }
        }

        pre {
            margin: 0;
            padding: 16px;
            background: #282c34;
            overflow-x: auto;

            code {
                font-family: var(--el-font-family-monospace);
                font-size: 14px;
                line-height: 1.6;
                padding: 0;
                background: transparent;
                border-radius: 0;
            }

            &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            &::-webkit-scrollbar-thumb {
                background: #3e4451;
                border-radius: 3px;
            }

            &::-webkit-scrollbar-track {
                background: #282c34;
            }
        }
    }

    // // 代码高亮主题覆盖样式
    // .hljs {
    //     background: transparent;
    //     color: #abb2bf;

    //     // 关键字
    //     .hljs-keyword {
    //         color: #c678dd;
    //     }

    //     // 字符串
    //     .hljs-string {
    //         color: #98c379;
    //     }

    //     // 注释
    //     .hljs-comment {
    //         color: #5c6370;
    //         font-style: italic;
    //     }

    //     // 函数
    //     .hljs-function {
    //         .hljs-title {
    //             color: #61afef;
    //         }

    //         .hljs-params {
    //             color: #abb2bf;
    //         }
    //     }

    //     // 数字
    //     .hljs-number {
    //         color: #d19a66;
    //     }

    //     // 类名
    //     .hljs-title.class_ {
    //         color: #e5c07b;
    //     }

    //     // 变量
    //     .hljs-variable {
    //         color: #e06c75;
    //     }

    //     // 属性
    //     .hljs-property {
    //         color: #e06c75;
    //     }

    //     // 标签
    //     .hljs-tag {
    //         color: #e06c75;
    //     }

    //     // 属性名
    //     .hljs-attr {
    //         color: #d19a66;
    //     }
    // }
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    }

    20% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }

    80% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    }
}
</style>