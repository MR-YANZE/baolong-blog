<template>
  <div class="articles container">
    <!-- 文章筛选区域 -->
    <el-card class="filter-section">
      <!-- 分类筛选 -->
      <div class="categories">
        <el-tag
          v-for="category in categories"
          :key="category.name"
          :class="{ active: currentCategory === category.name }"
          @click="selectCategory(category.name)"
          class="category-tag"
        >
          {{ category.name }}
        </el-tag>
      </div>

      <!-- 排序选项 -->
      <div class="sort-options">
        <el-radio-group v-model="sortBy" size="small">
          <el-radio-button label="newest">最新</el-radio-button>
          <el-radio-button label="hottest">最热</el-radio-button>
        </el-radio-group>
      </div>
    </el-card>

    <!-- 文章列表 -->
    <div class="article-grid">
      <el-row :gutter="20">
        <el-col :lg="8" :md="12" :sm="24" v-for="article in articles" :key="article.id">
          <el-card class="article-card" :body-style="{ padding: '0px' }">
            <!-- 文章封面 -->
            <div class="article-cover" v-if="article.cover">
              <img :src="article.cover" :alt="article.title">
            </div>

            <div class="article-content">
              <!-- 文章分类和标签 -->
              <div class="article-meta">
                <el-tag size="small" type="success">{{ article.category }}</el-tag>
                <el-tag
                  v-for="tag in article.tags"
                  :key="tag"
                  size="small"
                  class="tag"
                >
                  {{ tag }}
                </el-tag>
              </div>

              <!-- 文章标题 -->
              <router-link
                :to="{ name: 'Article', params: { id: article.id } }"
                class="article-title"
              >
                <h3>{{ article.title }}</h3>
              </router-link>

              <!-- 文章摘要 -->
              <p class="article-excerpt">{{ article.excerpt }}</p>

              <!-- 文章信息 -->
              <div class="article-info">
                                <span class="time">
                                    <el-icon><Calendar /></el-icon>
                                    {{ formatDate(article.createTime) }}
                                </span>
                <span class="views">
                                    <el-icon><View /></el-icon>
                                    {{ article.views }}
                                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[12, 24, 36]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Calendar, View } from '@element-plus/icons-vue'
import { useArticleStore } from '@/stores/article'
import { formatDate } from '@/utils/date'

const articleStore = useArticleStore()
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const currentCategory = ref('')
const sortBy = ref('newest')
const articles = ref([])

// 获取分类列表
const categories = computed(() => {
  return articleStore.getCategoriesWithCount
})

// 加载文章列表
const loadArticles = async () => {
  const { data, total: totalCount } = await articleStore.getArticles({
    page: currentPage.value,
    pageSize: pageSize.value,
    category: currentCategory.value,
    sort: sortBy.value
  })

  articles.value = data
  total.value = totalCount
}

// 处理分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

// 选择分类
const selectCategory = (category) => {
  currentCategory.value = currentCategory.value === category ? '' : category
  currentPage.value = 1
}

// 监听筛选条件变化
watch([currentCategory, sortBy], () => {
  loadArticles()
})

// 初始化
onMounted(() => {
  loadArticles()
})
</script>

<style lang="scss" scoped>
.articles {
  padding: 20px 0;

  .filter-section {
    margin-bottom: 20px;

    .categories {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 15px;

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

    .sort-options {
      display: flex;
      justify-content: flex-end;
    }
  }

  .article-grid {
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
        padding: 15px;

        .article-meta {
          margin-bottom: 10px;

          .tag {
            margin-left: 5px;
          }
        }

        .article-title {
          text-decoration: none;

          h3 {
            margin: 10px 0;
            color: var(--el-text-color-primary);
            transition: color 0.3s;

            &:hover {
              color: var(--el-color-primary);
            }
          }
        }

        .article-excerpt {
          color: var(--el-text-color-secondary);
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 15px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .article-info {
          display: flex;
          justify-content: space-between;
          color: var(--el-text-color-secondary);
          font-size: 13px;

          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
</style>