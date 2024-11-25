<template>
    <el-container class="layout-container">
        <el-header height="60px">
            <nav-header />
        </el-header>

        <el-main>
            <router-view />
        </el-main>

        <el-footer height="auot">
            <nav-footer />
        </el-footer>
    </el-container>
</template>

<script setup>
import NavHeader from '@/components/layout/NavHeader.vue'
import NavFooter from '@/components/layout/NavFooter.vue'
</script>

<style lang="scss" scoped>
.layout-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    .el-header {
        padding: 0;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 100;
    }

    .el-main {
        margin-top: 60px;
        padding: 20px;
        background-color: var(--el-bg-color);
    }

    .el-footer {
        text-align: center;
        background-color: var(--el-bg-color);
    }
}
</style>