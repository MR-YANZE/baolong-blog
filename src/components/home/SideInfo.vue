<template>
    <div class="side-info">
        <!-- 作者信息卡片 -->
        <author-card />

        <!-- 网站统计 -->
        <site-stats />

        <!-- 热门文章 -->
        <hot-articles />

        <!-- 标签云 -->
        <tag-cloud />
    </div>
</template>

<script setup>
import AuthorCard from './sidebar/AuthorCard.vue'
import SiteStats from './sidebar/SiteStats.vue'
import HotArticles from './sidebar/HotArticles.vue'
import TagCloud from './sidebar/TagCloud.vue'
</script>

<style lang="scss" scoped>
.side-info {
    >* {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>