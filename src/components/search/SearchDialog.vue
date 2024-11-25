<template>
    <el-dialog v-model="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="true"
        width="640px" class="search-dialog" @closed="handleClosed">
        <div class="search-container">
            <!-- 搜索输入框 -->
            <div class="search-input">
                <el-input v-model="searchQuery" placeholder="搜索文章..." :prefix-icon="Search" clearable
                    @input="handleSearch" @keydown.esc="visible = false" ref="inputRef" />
            </div>

            <!-- 搜索结果 -->
            <div v-if="searchQuery" class="search-results">
                <template v-if="loading">
                    <div class="loading-state">
                        <el-skeleton :rows="3" animated />
                    </div>
                </template>

                <template v-else-if="results.length > 0">
                    <div v-for="result in results" :key="result.id" class="result-item"
                        @click="handleResultClick(result)">
                        <div class="title">
                            <el-icon>
                                <Document />
                            </el-icon>
                            {{ result.title }}
                        </div>
                        <div class="summary" v-html="highlightText(result.summary)"></div>
                        <div class="meta">
                            <span class="time">{{ result.createTime }}</span>
                            <span class="tags">
                                <el-tag v-for="tag in result.tags" :key="tag" size="small" effect="plain">
                                    {{ tag }}
                                </el-tag>
                            </span>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <div class="empty-state">
                        <el-empty description="没有找到相关文章" />
                    </div>
                </template>
            </div>

            <!-- 快捷键提示 -->
            <div class="keyboard-shortcuts" v-if="!searchQuery">
                <div class="shortcut-item">
                    <kbd>↑</kbd><kbd>↓</kbd>
                    <span>选择</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Enter</kbd>
                    <span>打开</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Esc</kbd>
                    <span>关闭</span>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Document } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

const router = useRouter()
const visible = ref(false)
const searchQuery = ref('')
const loading = ref(false)
const results = ref([])
const inputRef = ref(null)

// 模拟搜索结果
const mockResults = [
    {
        id: 1,
        title: 'Vue 3 组合式 API 最佳实践',
        summary: '本文介绍了 Vue 3 组合式 API 的最佳实践和使用技巧...',
        createTime: '2024-01-15',
        tags: ['Vue', 'JavaScript']
    },
    {
        id: 2,
        title: 'TypeScript 高级技巧',
        summary: '深入探讨 TypeScript 的高级特性和实践经验...',
        createTime: '2024-01-10',
        tags: ['TypeScript', '前端开发']
    }
]

// 处理搜索
const handleSearch = debounce(async () => {
    if (!searchQuery.value.trim()) {
        results.value = []
        return
    }

    loading.value = true
    try {
        // 模拟 API 请求延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        // TODO: 替换为实际的 API 调用
        results.value = mockResults.filter(item =>
            item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.summary.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    } finally {
        loading.value = false
    }
}, 300)

// 高亮搜索文本
const highlightText = (text) => {
    if (!searchQuery.value) return text
    const regex = new RegExp(`(${searchQuery.value})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
}

// 处理结果点击
const handleResultClick = (result) => {
    visible.value = false
    router.push(`/article/${result.id}`)
}

// 处理对话框关闭
const handleClosed = () => {
    searchQuery.value = ''
    results.value = []
}

// 监听快捷键
const handleKeydown = (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        visible.value = true
        nextTick(() => {
            inputRef.value?.focus()
        })
    }
}

// 添加和移除事件监听
onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})

// 导出方法供外部使用
defineExpose({
    open: () => {
        visible.value = true
        nextTick(() => {
            inputRef.value?.focus()
        })
    }
})
</script>

<style lang="scss" scoped>
.search-dialog {
    :deep(.el-dialog__header) {
        display: none;
    }

    :deep(.el-dialog__body) {
        padding: 0;
    }
}

.search-container {
    .search-input {
        padding: 16px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        :deep(.el-input__wrapper) {
            box-shadow: none;

            &.is-focus {
                box-shadow: none;
            }
        }
    }

    .search-results {
        max-height: 60vh;
        overflow-y: auto;
        padding: 8px 0;

        .result-item {
            padding: 12px 16px;
            cursor: pointer;

            &:hover {
                background-color: var(--el-fill-color-light);
            }

            .title {
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 8px;
                color: var(--el-text-color-primary);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .summary {
                font-size: 14px;
                color: var(--el-text-color-secondary);
                margin-bottom: 8px;

                :deep(mark) {
                    background-color: var(--el-color-primary-light-9);
                    color: var(--el-color-primary);
                    padding: 0 2px;
                    border-radius: 2px;
                }
            }

            .meta {
                display: flex;
                align-items: center;
                gap: 16px;
                font-size: 12px;
                color: var(--el-text-color-secondary);

                .tags {
                    display: flex;
                    gap: 8px;
                }
            }
        }

        .loading-state,
        .empty-state {
            padding: 24px;
        }
    }

    .keyboard-shortcuts {
        padding: 16px;
        border-top: 1px solid var(--el-border-color-lighter);
        display: flex;
        justify-content: center;
        gap: 24px;

        .shortcut-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--el-text-color-secondary);
            font-size: 12px;

            kbd {
                background-color: var(--el-fill-color-light);
                border: 1px solid var(--el-border-color-lighter);
                border-radius: 4px;
                padding: 2px 6px;
                font-family: monospace;
            }
        }
    }
}
</style>