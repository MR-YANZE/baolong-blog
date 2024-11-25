<template>
    <div class="home container">
        <el-row :gutter="20">
            <!-- 左侧文章列表 -->
            <el-col :lg="18" :md="24">
                <article-list />
            </el-col>

            <!-- 右侧边栏 -->
            <el-col :lg="6" :md="24">
                <side-info />
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import ArticleList from '@/components/home/ArticleList.vue'
import SideInfo from '@/components/home/SideInfo.vue'
</script>

<style lang="scss" scoped>
.home {
    padding: 20px 0;
}

// 在小屏幕上调整间距
:deep(.el-row) {
    @media screen and (max-width: 992px) {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
}

:deep(.el-col) {
    @media screen and (max-width: 992px) {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
}
</style>