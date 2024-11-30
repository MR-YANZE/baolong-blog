<template>
  <div class="archive container">
    <!-- 分类统计 -->
    <el-card class="category-stats">
      <template #header>
        <div class="card-header">
          <span>分类统计</span>
          <span class="total">共 {{ totalArticles }} 篇文章</span>
        </div>
      </template>
      <div class="categories">
        <el-tag
          v-for="category in categories"
          :key="category.name"
          :class="{ active: currentCategory === category.name }"
          @click="selectCategory(category.name)"
          class="category-tag"
        >
          {{ category.name }} ({{ category.count }})
        </el-tag>
      </div>
    </el-card>

    <!-- 文章列表 -->
    <el-card class="article-list">
      <template #header>
        <div class="card-header">
          <span>{{ currentCategory || '全部' }}文章</span>
        </div>
      </template>
      <div class="timeline">
        <div v-for="(group, year) in groupedArticles" :key="year" class="year-group">
          <div class="year-label">{{ year }}</div>
          <div class="articles">
            <div v-for="article in group" :key="article.id" class="article-item">
              <span class="date">{{ formatDate(article.createTime) }}</span>
              <router-link :to="{ name: 'Article', params: { id: article.id } }" class="title">
                {{ article.title }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatDate } from '@/utils/date'
import { useArticleStore } from '@/stores/article'

const articleStore = useArticleStore()
const currentCategory = ref('')

// 获取分类列表
const categories = computed(() => {
  return articleStore.getCategoriesWithCount
})

// 获取文章总数
const totalArticles = computed(() => {
  return articleStore.totalArticles
})

// 按年份分组的文章列表
const groupedArticles = computed(() => {
  const articles = currentCategory.value
    ? articleStore.getArticlesByCategory(currentCategory.value)
    : articleStore.articles

  return Object.groupBy(articles, article =>
    new Date(article.createTime).getFullYear()
  )
})

// 选择分类
const selectCategory = (category) => {
  currentCategory.value = currentCategory.value === category ? '' : category
}

// 初始化数据
onMounted(async () => {
  // 不需要特别获取分类，因为已经在 store 中了
  // 如果需要从服务器获取，可以在这里调用
})
</script>

<style lang="scss" scoped>
.archive {
  padding: 20px 0;

  .category-stats {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .total {
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }
    }

    .categories {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .category-tag {
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
        }

        &.active {
          background-color: var(--el-color-primary);
          color: white;
        }
      }
    }
  }

  .article-list {
    .timeline {
      .year-group {
        margin-bottom: 20px;

        .year-label {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
          color: var(--el-color-primary);
        }

        .articles {
          .article-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 4px;
            transition: all 0.3s;

            &:hover {
              background-color: var(--el-fill-color-light);
            }

            .date {
              color: var(--el-text-color-secondary);
              margin-right: 20px;
              font-size: 14px;
            }

            .title {
              color: var(--el-text-color-primary);
              text-decoration: none;

              &:hover {
                color: var(--el-color-primary);
              }
            }
          }
        }
      }
    }
  }
}
</style>