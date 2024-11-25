<template>
    <div class="article-list">
        <!-- 添加调试信息 -->
        <div v-if="loading">加载中...</div>
        <div v-if="articles.length === 0">暂无文章</div>

        <el-card v-for="article in articles" :key="article.id" class="article-card" :body-style="{ padding: '0px' }">
            <!-- 文章封面图 -->
            <div class="article-cover" v-if="article.cover">
                <img :src="article.cover" :alt="article.title">
            </div>

            <div class="article-content">
                <!-- 文章标签 -->
                <div class="article-tags">
                    <el-tag v-for="tag in article.tags" :key="tag" size="small" effect="light" class="tag">
                        {{ tag }}
                    </el-tag>
                </div>

                <!-- 文章标题 -->
                <router-link :to="{ name: 'Article', params: { id: article.id } }" class="article-title">
                    <h2>{{ article.title }}</h2>
                </router-link>

                <!-- 文章摘要 -->
                <p class="article-excerpt">{{ article.excerpt }}</p>

                <!-- 文章信息 -->
                <div class="article-meta">
                    <span class="time">
                        <el-icon>
                            <Calendar />
                        </el-icon>
                        {{ formatDate(article.createTime) }}
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
            </div>
        </el-card>

        <!-- 加载更多 -->
        <div class="load-more" v-if="hasMore">
            <el-button :loading="loading" @click="loadMore">
                加载更多
            </el-button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Calendar, View, ChatLineRound } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/date'
import { useArticleStore } from '@/stores/article'

const articleStore = useArticleStore()
const articles = ref([])
const currentPage = ref(1)
const pageSize = 10
const loading = ref(false)
const hasMore = ref(true)

// 加载文章列表
const loadArticles = async (page = 1) => {
    if (loading.value) return

    loading.value = true
    try {
        console.log('Loading articles...') // 添加调试日志
        const { data, total } = await articleStore.getArticles({
            page,
            pageSize
        })

        console.log('Loaded articles:', data) // 添加调试日志

        if (page === 1) {
            articles.value = data
        } else {
            articles.value.push(...data)
        }

        hasMore.value = articles.value.length < total
    } finally {
        loading.value = false
    }
}

// 加载更多
const loadMore = () => {
    currentPage.value++
    loadArticles(currentPage.value)
}

onMounted(() => {
    loadArticles()
})
</script>

<style lang="scss" scoped>
.article-list {
    .article-card {
        margin-bottom: 20px;
        transition: transform 0.3s;

        &:hover {
            transform: translateY(-5px);
        }

        .article-cover {
            height: 200px;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s;

                &:hover {
                    transform: scale(1.1);
                }
            }
        }

        .article-content {
            padding: 20px;

            .article-tags {
                margin-bottom: 12px;

                .tag {
                    margin-right: 8px;
                    margin-bottom: 8px;
                }
            }

            .article-title {
                text-decoration: none;

                h2 {
                    margin: 0 0 12px;
                    font-size: 1.5rem;
                    color: var(--text-primary);
                    transition: color 0.3s;

                    &:hover {
                        color: var(--hover-color);
                    }
                }
            }

            .article-excerpt {
                margin: 0 0 16px;
                color: var(--text-secondary);
                line-height: 1.6;
            }

            .article-meta {
                display: flex;
                align-items: center;
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

    .load-more {
        text-align: center;
        margin-top: 20px;
    }
}
</style>