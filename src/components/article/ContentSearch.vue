<template>
    <div class="content-search">
        <!-- 搜索触发器 -->
        <el-button class="search-trigger" @click="showSearch = true">
            <el-icon>
                <Search />
            </el-icon>
            搜索内容
            <span class="shortcut">(Ctrl + F)</span>
        </el-button>

        <!-- 搜索弹窗 -->
        <el-dialog v-model="showSearch" title="搜索内容" width="500px" :close-on-click-modal="false" destroy-on-close>
            <div class="search-container">
                <el-input v-model="searchText" placeholder="输入搜索内容..." :prefix-icon="Search" @input="handleSearch"
                    @keydown.enter="handleNext" @keydown.esc="showSearch = false" ref="searchInput">
                    <template #append>
                        <el-button-group>
                            <el-button :disabled="!hasResults" @click="handlePrev">
                                <el-icon>
                                    <ArrowUp />
                                </el-icon>
                            </el-button>
                            <el-button :disabled="!hasResults" @click="handleNext">
                                <el-icon>
                                    <ArrowDown />
                                </el-icon>
                            </el-button>
                        </el-button-group>
                    </template>
                </el-input>

                <!-- 搜索统计 -->
                <div class="search-stats" v-if="hasResults">
                    <span>{{ currentIndex + 1 }}/{{ totalMatches }} 处匹配</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Search, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { useDebounce } from '@/composables/useDebounce'

const props = defineProps({
    content: {
        type: String,
        required: true
    }
})

const showSearch = ref(false)
const searchText = ref('')
const searchInput = ref(null)
const matches = ref([])
const currentIndex = ref(-1)

// 计算属性
const hasResults = computed(() => matches.value.length > 0)
const totalMatches = computed(() => matches.value.length)

// 搜索处理函数
const handleSearch = useDebounce(() => {
    if (!searchText.value) {
        clearSearch()
        return
    }

    // 移除旧的高亮
    removeHighlights()

    // 在内容中查找匹配项
    const content = props.content
    const regex = new RegExp(escapeRegExp(searchText.value), 'gi')
    const articleContent = document.querySelector('.article-content')

    if (!articleContent) return

    // 保存原始内容
    if (!articleContent.getAttribute('data-original')) {
        articleContent.setAttribute('data-original', articleContent.innerHTML)
    }

    // 高亮匹配文本
    let html = articleContent.getAttribute('data-original')
    html = html.replace(regex, match => `<mark class="search-highlight">${match}</mark>`)
    articleContent.innerHTML = html

    // 收集所有高亮元素
    matches.value = Array.from(document.querySelectorAll('.search-highlight'))
    currentIndex.value = matches.value.length > 0 ? 0 : -1

    // 滚动到第一个匹配项
    if (matches.value.length > 0) {
        scrollToMatch(0)
    }
}, 300)

// 清除搜索
const clearSearch = () => {
    matches.value = []
    currentIndex.value = -1
    removeHighlights()
}

// 移除高亮
const removeHighlights = () => {
    const articleContent = document.querySelector('.article-content')
    if (articleContent && articleContent.getAttribute('data-original')) {
        articleContent.innerHTML = articleContent.getAttribute('data-original')
    }
}

// 转到下一个匹配项
const handleNext = () => {
    if (!hasResults.value) return
    currentIndex.value = (currentIndex.value + 1) % matches.value.length
    scrollToMatch(currentIndex.value)
}

// 转到上一个匹配项
const handlePrev = () => {
    if (!hasResults.value) return
    currentIndex.value = (currentIndex.value - 1 + matches.value.length) % matches.value.length
    scrollToMatch(currentIndex.value)
}

// 滚动到匹配项
const scrollToMatch = (index) => {
    const match = matches.value[index]
    if (match) {
        match.classList.add('search-highlight-active')
        matches.value.forEach((m, i) => {
            if (i !== index) m.classList.remove('search-highlight-active')
        })
        match.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
}

// 转义正则表达式特殊字符
const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 键盘快捷键处理
const handleKeydown = (e) => {
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault()
        showSearch.value = true
        nextTick(() => {
            searchInput.value?.focus()
        })
    }
}

// 监听键盘事件
onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    removeHighlights()
})

// 监听弹窗关闭
watch(showSearch, (val) => {
    if (!val) {
        clearSearch()
        searchText.value = ''
    }
})
</script>

<style lang="scss" scoped>
.content-search {
    .search-trigger {
        display: inline-flex;
        align-items: center;
        gap: 4px;

        .shortcut {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            margin-left: 4px;
        }
    }

    .search-container {
        .search-stats {
            margin-top: 8px;
            text-align: right;
            font-size: 12px;
            color: var(--el-text-color-secondary);
        }
    }
}
</style>

<style>
/* 高亮样式 */
.search-highlight {
    background-color: rgba(255, 255, 0, 0.4);
    padding: 2px 0;
}

.search-highlight-active {
    background-color: rgba(255, 150, 0, 0.6);
}

/* 暗色模式 */
html.dark .search-highlight {
    background-color: rgba(255, 255, 0, 0.2);
}

html.dark .search-highlight-active {
    background-color: rgba(255, 150, 0, 0.4);
}
</style>