<template>
    <el-card class="tag-cloud">
        <template #header>
            <div class="card-header">
                <span>文章标签</span>
            </div>
        </template>

        <div class="tags-wrapper">
            <router-link v-for="tag in tags" :key="tag.name" :to="{ name: 'Tag', params: { name: tag.name } }"
                class="tag-item" :style="getTagStyle(tag.count)">
                {{ tag.name }}
                <span class="count">({{ tag.count }})</span>
            </router-link>
        </div>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'

// 模拟标签数据
const tags = ref([
    { name: 'JavaScript', count: 25 },
    { name: 'Vue', count: 18 },
    { name: 'CSS', count: 15 },
    { name: 'HTML', count: 12 },
    { name: 'TypeScript', count: 10 },
    { name: 'React', count: 8 },
    { name: 'Node.js', count: 7 },
    { name: 'Webpack', count: 6 },
    { name: 'Git', count: 5 },
    { name: 'Python', count: 4 },
    { name: 'Docker', count: 3 },
    { name: 'Linux', count: 2 }
])

// 根据文章数量计算标签样式
const getTagStyle = (count) => {
    const maxCount = Math.max(...tags.value.map(t => t.count))
    const minCount = Math.min(...tags.value.map(t => t.count))
    const fontSize = 12 + ((count - minCount) / (maxCount - minCount)) * 8

    return {
        fontSize: `${fontSize}px`,
        opacity: 0.6 + ((count - minCount) / (maxCount - minCount)) * 0.4
    }
}
</script>

<style lang="scss" scoped>
.tag-cloud {
    .card-header {
        font-weight: bold;
    }

    .tags-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .tag-item {
            text-decoration: none;
            color: var(--text-color);
            transition: all 0.3s;

            &:hover {
                color: var(--hover-color);
                transform: scale(1.1);
            }

            .count {
                font-size: 12px;
                color: var(--text-secondary);
            }
        }
    }
}
</style>