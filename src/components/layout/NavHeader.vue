<template>
    <div class="nav-header">
        <div class="container">
            <!-- Logo区域 -->
            <div class="logo">
                <router-link to="/">
                    <span class="site-name">暴龙Baolong</span>
                </router-link>
            </div>

            <!-- 导航菜单 -->
            <el-menu :default-active="activeMenu" mode="horizontal" :ellipsis="false" class="nav-menu"
                @select="handleSelect">
                <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
                    <el-icon>
                        <component :is="item.icon" />
                    </el-icon>
                    {{ item.name }}
                </el-menu-item>
            </el-menu>

            <!-- 右侧操作区 -->
            <div class="action-area">
                <!-- 主题切换 -->
                <el-button class="theme-toggle" :icon="isDark ? Sunny : Moon" circle @click="toggleTheme" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useTheme } from '@/composables/useTheme'

// 路由实例
const router = useRouter()
const route = useRoute()

// 主题切换
const { isDark, toggleTheme } = useTheme()

// 菜单配置
const menuItems = [
    { name: '首页', path: '/', icon: 'House' },
    { name: '文章', path: '/articles', icon: 'Document' },
    { name: '存档', path: '/archive', icon: 'Folder' },
    { name: '友链', path: '/friends', icon: 'Link' },
    { name: '关于', path: '/about', icon: 'User' }
]

// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 处理菜单选择
const handleSelect = (key) => {
    router.push(key)
}
</script>

<style lang="scss" scoped>
.nav-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: 60px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
    background-color: var(--el-bg-color);

    .container {
        max-width: 1200px;
        margin: 0 auto;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
    }

    .logo {
        a {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--el-text-color-primary);

            .site-name {
                font-size: 1.5rem;
                font-weight: bold;
            }
        }
    }

    .nav-menu {
        flex: 1;
        justify-content: center;
        border-bottom: none;
        margin: 0 20px;

        :deep(.el-menu-item) {
            display: flex;
            align-items: center;

            .el-icon {
                margin-right: 4px;
            }
        }
    }

    .action-area {
        .theme-toggle {
            font-size: 20px;
        }
    }
}

// 响应式设计
@media screen and (max-width: 768px) {
    .nav-header {
        .nav-menu {
            display: none;
        }
    }
}
</style>