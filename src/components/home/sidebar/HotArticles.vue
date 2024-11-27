<template>
    <el-card class="hot-articles">
        <template #header>
            <div class="card-header">
                <span>热门文章</span>
            </div>
        </template>

        <div class="article-list">
            <router-link v-for="(article, index) in hotArticles" :key="article.id"
                :to="{ name: 'Article', params: { id: article.id } }" class="article-item">
                <div class="rank" :class="{ 'top-3': index < 3 }">
                    {{ index + 1 }}
                </div>
                <div class="content">
                    <div class="title">{{ article.title }}</div>
                    <div class="meta">
                        <span class="views">
                            <el-icon>
                                <View />
                            </el-icon>
                            {{ article.views }}
                        </span>
                    </div>
                </div>
            </router-link>
        </div>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { View } from '@element-plus/icons-vue'

// 模拟热门文章数据
const hotArticles = ref([
    {
        id: 1,
        title: '如何使用 Vue 3 Composition API',
        views: 2345
    },
    {
        id: 2,
        title: 'TypeScript 入门指南入门指南入门指南入门指南入门指南入门指南',
        views: 2100
    },
    {
        id: 3,
        title: '前端性能优化实践',
        views: 1890
    },
    {
        id: 4,
        title: 'CSS Grid 布局详解',
        views: 1654
    },
    {
        id: 5,
        title: '深入理解 JavaScript 原型链',
        views: 1432
    }
])
</script>

<style lang="scss" scoped>
.hot-articles {
    .card-header {
        font-weight: bold;
    }

    .article-list {
        .article-item {
            display: flex;
            align-items: flex-start;
            padding: 10px 0;
            text-decoration: none;
            border-bottom: 1px solid var(--border-color);

            &:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }

            &:first-child {
                padding-top: 0;
            }

            .rank {
                width: 24px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                background-color: var(--el-fill-color-lighter);
                color: var(--text-secondary);
                border-radius: 4px;
                margin-right: 12px;
                font-size: 14px;
                flex-shrink: 0;

                &.top-3 {
                    background-color: var(--el-color-danger);
                    color: white;
                }
            }

            .content {
                flex: 1;
                min-width: 0; // 防止文本溢出

                .title {
                    color: var(--text-color);
                    font-size: 14px;
                    line-height: 1.4;
                    margin-bottom: 4px;
                    @include text-overflow;

                    &:hover {
                        color: var(--hover-color);
                    }
                }

                .meta {
                    font-size: 12px;
                    color: var(--text-secondary);

                    .views {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    }
                }
            }
        }
    }
}
</style>