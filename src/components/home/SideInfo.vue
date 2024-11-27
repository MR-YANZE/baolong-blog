<template>
    <div class="side-info">
      <!-- 滑动内容 -->
      <div class="top-content">
        <!-- 作者信息卡片 -->
        <author-card />

        <!-- 网站统计 -->
        <site-stats />
      </div>

      <!-- 固定内容 -->
      <div class="hot-articles-wrapper" ref="hotArticlesWrapper">
        <div :class="{ 'fixed': isFixed }" ref="hotArticles">
          <!-- 文章标签 -->
          <tag-cloud  class="mb-20" />

          <!-- 热门文章 -->
          <hot-articles />
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AuthorCard from './sidebar/AuthorCard.vue'
import SiteStats from './sidebar/SiteStats.vue'
import HotArticles from './sidebar/HotArticles.vue'
import TagCloud from './sidebar/TagCloud.vue'

const hotArticlesWrapper = ref(null)
const hotArticles = ref(null)
const isFixed = ref(false)
const offsetTop = ref(0)
const wrapperWidth = ref(0)

const handleScroll = () => {
  if (!hotArticlesWrapper.value) return

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const wrapperRect = hotArticlesWrapper.value.getBoundingClientRect()

  // 保存初始位置和宽度
  if (offsetTop.value === 0) {
    offsetTop.value = wrapperRect.top + scrollTop
    wrapperWidth.value = wrapperRect.width
  }

  isFixed.value = scrollTop > offsetTop.value - 80 // 80px 是导航栏高度，根据实际调整
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始化位置
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.side-info {
  .top-content {
    margin-bottom: 20px;

    > * {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .hot-articles-wrapper {
    margin-bottom: 20px;

    > div {
      width: 100%;

      &.fixed {
        position: fixed;
        top: 80px; // 与上面的 scrollTop 计算对应
        width: v-bind(wrapperWidth + 'px');
        z-index: 10;
      }
    }
  }
}

.mb-20 {
  margin-bottom: 20px;
}

// 在小屏幕上取消固定效果
@media screen and (max-width: 992px) {
  .side-info .hot-articles-wrapper > div.fixed {
    position: static;
    width: 100%;
  }
}
</style>