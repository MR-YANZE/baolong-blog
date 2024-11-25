<template>
    <div class="tag-page container">
        <el-card class="tag-header">
            <div class="tag-info">
                <el-icon class="icon">
                    <Collection />
                </el-icon>
                <h1 class="title">
                    标签：{{ $route.params.name }}
                    <span class="count">({{ articles.length }})</span>
                </h1>
            </div>
        </el-card>

        <el-row :gutter="20" class="main-content">
            <!-- 文章列表 -->
            <el-col :lg="18" :md="24">
                <el-card v-if="articles.length > 0">
                    <div v-for="article in articles" :key="article.id" class="article-item">
                        <router-link :to="{ name: 'Article', params: { id: article.id } }" class="title">
                            {{ article.title }}
                        </router-link>
                        <div class="meta">
                            <span class="time">
                                <el-icon>
                                    <Calendar />
                                </el-icon>
                                {{ article.createTime }}
                            </span>
                            <span class="views">
                                <el-icon>
                                    <View />
                                </el-icon>
                                {{ article.views }} 阅读
                            </span>
                        </div>
                    </div>
                </el-card>
                <el-empty v-else description="暂无相关文章" />
            </el-col>

            <!-- 侧边栏 -->
            <el-col :lg="6" :md="24">
                <side-info />
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Collection, Calendar, View } from '@element-plus/icons-vue'
import SideInfo from '@/components/home/SideInfo.vue'

const route = useRoute()
const articles = ref([])

// 模拟获取标签相关文章
const fetchTagArticles = (tagName) => {
    // 模拟API调用
    articles.value = [
        {
            id: 1,
            title: `${tagName} 相关文章 1`,
            createTime: '2024-01-01',
            views: 1234
        },
        {
            id: 2,
            title: `${tagName} 相关文章 2`,
            createTime: '2024-01-02',
            views: 567
        },
        {
            id: 3,
            title: `${tagName} 相关文章 3`,
            createTime: '2024-01-03',
            views: 890
        }
    ]
}

// 监听路由参数变化
watch(
    () => route.params.name,
    (newTag) => {
        if (newTag) {
            fetchTagArticles(newTag)
        }
    }
)

onMounted(() => {
    if (route.params.name) {
        fetchTagArticles(route.params.name)
    }
})
</script>

<style lang="scss" scoped>
.tag-page {
    padding: 20px 0;

    .tag-header {
        margin-bottom: 20px;

        .tag-info {
            display: flex;
            align-items: center;
            gap: 10px;

            .icon {
                font-size: 24px;
                color: var(--el-color-primary);
            }

            .title {
                margin: 0;
                font-size: 1.5rem;
                color: var(--text-color);

                .count {
                    font-size: 1rem;
                    color: var(--text-secondary);
                    font-weight: normal;
                }
            }
        }
    }

    .main-content {
        .article-item {
            padding: 15px 0;
            border-bottom: 1px solid var(--border-color);

            &:first-child {
                padding-top: 0;
            }

            &:last-child {
                padding-bottom: 0;
                border-bottom: none;
            }

            .title {
                display: block;
                font-size: 1.1rem;
                color: var(--text-color);
                text-decoration: none;
                margin-bottom: 8px;
                transition: color 0.3s;

                &:hover {
                    color: var(--hover-color);
                }
            }

            .meta {
                display: flex;
                gap: 16px;
                color: var(--text-secondary);
                font-size: 0.9rem;

                span {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
            }
        }
    }
}
</style>