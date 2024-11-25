<template>
    <el-card class="author-card" :body-style="{ padding: '0' }">
        <!-- 背景封面 -->
        <div class="cover-bg"></div>

        <!-- 作者信息 -->
        <div class="author-info">
            <el-avatar :size="80" :src="authorInfo.avatar" class="avatar" />
            <h3 class="name">{{ authorInfo.name }}</h3>
            <p class="description">{{ authorInfo.description }}</p>

            <!-- 社交链接 -->
            <div class="social-links">
                <a v-for="(link, index) in authorInfo.socialLinks" :key="index" :href="link.url" :title="link.name"
                    target="_blank" class="social-item">
                    <el-icon>
                        <component :is="link.icon" />
                    </el-icon>
                </a>
            </div>

            <!-- 文章统计 -->
            <div class="article-stats">
                <div class="stat-item">
                    <div class="count">{{ authorInfo.stats.articles }}</div>
                    <div class="label">文章</div>
                </div>
                <div class="stat-item">
                    <div class="count">{{ authorInfo.stats.tags }}</div>
                    <div class="label">标签</div>
                </div>
                <div class="stat-item">
                    <div class="count">{{ authorInfo.stats.categories }}</div>
                    <div class="label">分类</div>
                </div>
            </div>
        </div>
    </el-card>
</template>

<script setup>
// 模拟作者信息数据
const authorInfo = {
    avatar: 'https://picsum.photos/200',
    name: '暴龙Baolong',
    description: '后端开发工程师，热爱技术分享和捣腾。',
    socialLinks: [
        { name: 'GitHub', icon: 'Position', url: 'https://github.com' },
        { name: '掘金', icon: 'Edit', url: 'https://juejin.cn' },
        { name: '知乎', icon: 'Share', url: 'https://zhihu.com' }
    ],
    stats: {
        articles: 108,
        tags: 26,
        categories: 12
    }
}
</script>

<style lang="scss" scoped>
.author-card {
    .cover-bg {
        height: 80px;
        background-image: linear-gradient(to right, #92fe9d 0%, #00c9ff 100%);
    }

    .author-info {
        padding: 0 20px 20px;
        margin-top: -40px;
        text-align: center;

        .avatar {
            border: 4px solid var(--el-bg-color);
            margin-bottom: 10px;
        }

        .name {
            margin: 10px 0;
            font-size: 1.2rem;
            color: var(--text-color);
        }

        .description {
            margin: 0 0 15px;
            font-size: 0.9rem;
            color: var(--text-secondary);
            line-height: 1.5;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 15px;

            .social-item {
                color: var(--text-secondary);
                transition: color 0.3s;

                &:hover {
                    color: var(--hover-color);
                }
            }
        }

        .article-stats {
            display: flex;
            justify-content: space-around;
            padding-top: 15px;
            border-top: 1px solid var(--border-color);

            .stat-item {
                .count {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: var(--text-color);
                }

                .label {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }
            }
        }
    }
}
</style>