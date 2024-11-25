<template>
    <el-card class="site-stats">
        <template #header>
            <div class="card-header">
                <span>网站统计</span>
            </div>
        </template>

        <div class="stats-list">
            <div v-for="(stat, index) in statistics" :key="index" class="stat-item">
                <el-icon>
                    <component :is="stat.icon" />
                </el-icon>
                <span class="label">{{ stat.label }}：</span>
                <span class="value">{{ stat.value }}</span>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { Timer, View, ChatLineSquare } from '@element-plus/icons-vue'

const statistics = [
    {
        icon: 'Timer',
        label: '运行时间',
        value: '365 天'
    },
    {
        icon: 'View',
        label: '总访问量',
        value: '12,345'
    },
    {
        icon: 'ChatLineSquare',
        label: '评论数',
        value: '678'
    }
]
</script>

<style lang="scss" scoped>
.site-stats {
    .card-header {
        font-weight: bold;
    }

    .stats-list {
        .stat-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            &:last-child {
                margin-bottom: 0;
            }

            .el-icon {
                margin-right: 8px;
                color: var(--text-secondary);
            }

            .label {
                color: var(--text-secondary);
            }

            .value {
                margin-left: 4px;
                color: var(--text-color);
            }
        }
    }
}
</style>