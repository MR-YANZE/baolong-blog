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
            <!--<div class="social-links">-->
            <!--    <a v-for="(link, index) in authorInfo.socialLinks" :key="index" :href="link.url" :title="link.name"-->
            <!--        target="_blank" class="social-item">-->
            <!--        <el-icon>-->
            <!--            <component :is="link.icon" />-->
            <!--        </el-icon>-->
            <!--    </a>-->
            <!--</div>-->
          <div class="social-links">
            <!-- GitHub -->
            <el-tooltip content="GitHub" placement="top">
              <a href="https://github.com/MR-YANZE" target="_blank" class="social-link">
                <SvgIcon name="github" size="20" />
              </a>
            </el-tooltip>

            <!-- Gitee -->
            <el-tooltip content="Gitee" placement="top">
              <a href="https://gitee.com/yan-zer" target="_blank" class="social-link">
                <SvgIcon name="gitee" size="20" />
              </a>
            </el-tooltip>

            <!-- CSDN -->
            <el-tooltip content="CSDN" placement="top">
              <a href="https://blog.csdn.net/yanzer" target="_blank" class="social-link">
                <SvgIcon name="csdn" size="20" />
              </a>
            </el-tooltip>

            <!-- QQ -->
            <el-tooltip content="QQ：510132075" placement="top">
              <a href="tencent://message/?uin=510132075&Site=&Menu=yes" target="_blank" class="social-link">
                <SvgIcon name="qq" size="20" />
              </a>
            </el-tooltip>

            <!-- 微信 -->
            <el-tooltip content="微信" placement="top">
              <el-popover trigger="hover" width="200" popper-class="qrcode-popover">
                <template #reference>
                  <div class="social-link">
                    <SvgIcon name="weixin" size="20" />
                  </div>
                </template>
                <div class="qrcode-container">
                  <img :src="wxImage" alt="微信二维码">
                  <p>扫码添加我的微信</p>
                </div>
              </el-popover>
            </el-tooltip>
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
import SvgIcon from '@/components/common/SvgIcon.vue'

// 微信二维码图片
const wxImage = 'http://47.99.194.194:9000/baolongoss/wxQr.jpg'

// 模拟作者信息数据
const authorInfo = {
    avatar: 'http://47.99.194.194:9000/baolongoss/baolong.jpg',
    name: '暴龙Baolong',
    description: '后端开发工程师，热爱编程，享受创造。',
    // socialLinks: [
    //     { name: 'GitHub', icon: 'Position', url: 'https://github.com' },
    //     { name: '掘金', icon: 'Edit', url: 'https://juejin.cn' },
    //     { name: '知乎', icon: 'Share', url: 'https://zhihu.com' }
    // ],
    stats: {
        articles: 108,
        tags: 26,
        categories: 12
    }
}
</script>

<style lang="scss" scoped>
/*.author-card {
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
}*/
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
      //border: 4px solid var(--el-bg-color);
      //margin-bottom: 10px;
      border: 4px solid var(--el-bg-color);
      transition: all 0.3s ease-in-out;
      cursor: pointer;

      &:hover {
        transform: rotate(360deg);
        border-color: var(--el-color-primary);
      }
    }

    .name {
      margin: 10px 0;
      font-size: 1.2rem;
      color: var(--el-text-color-primary);
    }

    .description {
      margin: 0 0 15px;
      font-size: 0.9rem;
      color: var(--el-text-color-regular);
      line-height: 1.5;
    }

    // 新的社交链接样式
    .social-links {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 15px;

      .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--el-fill-color-light);
        color: var(--el-text-color-regular);
        transition: all 0.3s ease;
        cursor: pointer;
        text-decoration: none;

        &:hover {
          background: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
          transform: translateY(-2px);
        }
      }
    }

    .article-stats {
      display: flex;
      justify-content: space-around;
      padding-top: 15px;
      border-top: 1px solid var(--el-border-color-lighter);

      .stat-item {
        .count {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--el-text-color-primary);
        }

        .label {
          font-size: 0.9rem;
          color: var(--el-text-color-regular);
        }
      }
    }
  }
}

.qrcode-container {
  text-align: center;

  img {
    width: 150px;
    height: 150px;
    margin-bottom: 10px;
  }

  p {
    margin: 0;
    color: var(--el-text-color-regular);
    font-size: 14px;
  }
}
</style>