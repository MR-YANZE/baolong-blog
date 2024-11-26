<template>
  <div class="about-page">
    <!-- 个人信息卡片 -->
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">
          <img :src="defaultAvatar" alt="暴龙Baolong">
        </div>
        <h1 class="name">Baolong</h1>
        <p class="bio">后端开发工程师 / 无名博主</p>
      </div>
      <!-- 联系方式 -->
      <div class="social-links">
        <!-- GitHub -->
        <el-tooltip content="GitHub" placement="top">
          <a href="https://github.com/MR-YANZE" target="_blank" class="social-link">
            <SvgIcon name="github" size="24" />
          </a>
        </el-tooltip>

        <!-- Gitee -->
        <el-tooltip content="Gitee" placement="top">
          <a href="https://gitee.com/yan-zer" target="_blank" class="social-link">
            <SvgIcon name="gitee" size="24" />
          </a>
        </el-tooltip>

        <!-- CSDN -->
        <el-tooltip content="CSDN" placement="top">
          <a href="https://blog.csdn.net/yanzer" target="_blank" class="social-link">
            <SvgIcon name="csdn" size="24" />
          </a>
        </el-tooltip>

        <!-- QQ -->
        <el-tooltip content="QQ：510132075" placement="top">
          <a href="tencent://message/?uin=510132075&Site=&Menu=yes" target="_blank" class="social-link">
            <SvgIcon name="qq" size="24" />
          </a>
        </el-tooltip>

        <!-- 微信 -->
        <el-tooltip content="微信" placement="top">
          <el-popover
            trigger="hover"
            width="200"
            popper-class="qrcode-popover"
          >
            <template #reference>
              <div class="social-link">
                <SvgIcon name="weixin" size="24" />
              </div>
            </template>
            <div class="qrcode-container">
              <img :src="wxImage" alt="微信二维码">
              <p>扫码添加我的微信</p>
            </div>
          </el-popover>
        </el-tooltip>
      </div>
    </div>

    <!-- 个人介绍 -->
    <div class="about-content">
      <div class="section">
        <h2>👋 关于我</h2>
        <div class="content-card">
          <p>Hi，我是暴龙Baolong，一名后端开发工程师。</p>
          <p>主要专注于 Java 技术栈，热爱编程，享受创造的过程。有近两年的开发经验，在此期间参与过多个项目的开发与维护。</p>
          <p>喜欢通过博客分享学习心得，记录技术积累，同时也在不断探索新的技术领域。</p>
        </div>
      </div>

      <!-- 技能标签 -->
      <!--<div class="section">
        <h2>🛠️ 技能栈</h2>
        <div class="content-card">
          <div class="skills">
            &lt;!&ndash; 核心技能 &ndash;&gt;
            <el-tag class="skill-tag" effect="plain" type="success">Java</el-tag>
            <el-tag class="skill-tag" effect="plain" type="success">Spring Boot</el-tag>
            <el-tag class="skill-tag" effect="plain" type="success">Spring Cloud</el-tag>
            <el-tag class="skill-tag" effect="plain" type="success">MyBatis</el-tag>

            &lt;!&ndash; 数据库 &ndash;&gt;
            <el-tag class="skill-tag" effect="plain" type="warning">MySQL</el-tag>
            <el-tag class="skill-tag" effect="plain" type="warning">Redis</el-tag>

            &lt;!&ndash; 中间件 &ndash;&gt;
            <el-tag class="skill-tag" effect="plain" type="info">RabbitMQ</el-tag>
            <el-tag class="skill-tag" effect="plain" type="info">Nginx</el-tag>

            &lt;!&ndash; 工具 &ndash;&gt;
            <el-tag class="skill-tag" effect="plain">Git</el-tag>
            <el-tag class="skill-tag" effect="plain">Maven</el-tag>
            <el-tag class="skill-tag" effect="plain">Docker</el-tag>

            &lt;!&ndash; 前端 &ndash;&gt;
            <el-tag class="skill-tag" effect="plain" type="info">Vue.js</el-tag>
            <el-tag class="skill-tag" effect="plain" type="info">HTML/CSS</el-tag>
          </div>
        </div>
      </div>-->
      <div class="section">
        <h2>🛠️ 技能栈</h2>
        <div class="content-card">
          <div class="skills-grid">
            <div v-for="(category, index) in skills" :key="index" class="skill-category-card">
              <div class="category-header">
                <h3>{{ category.name }}</h3>
              </div>
              <div class="skills-list">
                <div v-for="(skill, idx) in category.items" :key="idx" class="skill-item">
                  <el-tag
                    :type="getTagType(skill.level)"
                    effect="light"
                    class="skill-tag"
                  >
                    {{ skill.name }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 工作经历 -->
      <div class="section">
        <h2>💼 工作经历</h2>
        <div class="content-card">
          <div class="timeline">
            <p>2022 - 至今：后端开发工程师</p>
            <ul>
              <li>参与企业级应用系统的设计与开发</li>
              <li>负责核心业务模块的开发与维护</li>
              <li>进行系统性能优化和问题排查</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 个人爱好 -->
      <div class="section">
        <h2>🎯 个人爱好</h2>
        <div class="content-card">
          <p>除了编程，我还喜欢：</p>
          <ul>
            <li>📚 阅读技术书籍和文章</li>
            <li>✍️ 写技术博客分享经验</li>
            <li>🎮 玩游戏放松心情</li>
            <li>🏃‍♂️ 运动保持健康</li>
          </ul>
        </div>
      </div>

      <!-- 博客统计 -->
      <div class="section">
        <h2>📊 博客统计</h2>
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-number">{{ stats.articles }}</div>
            <div class="stat-label">文章数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.views }}</div>
            <div class="stat-label">总访问量</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.days }}</div>
            <div class="stat-label">运行天数</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SvgIcon from '@/components/comment/SvgIcon.vue'

// 默认头像
const defaultAvatar = 'http://47.99.194.194:9000/baolongoss/baolong.jpg'
const wxImage = 'http://47.99.194.194:9000/baolongoss/wxQr.jpg'

// 技能标签
const skills = ref([
  {
    name: '后端开发',
    items: [
      { name: 'Java', level: 90 },
      { name: 'Spring Boot', level: 80 },
      { name: 'Spring Cloud', level: 75 },
      { name: 'MyBatis', level: 80 }
    ]
  },
  {
    name: '前端开发',
    items: [
      { name: 'HTML/CSS', level: 80 },
      { name: 'JavaScript', level: 80 },
      { name: 'Vue', level: 70 }
    ]
  },
  {
    name: '数据库/中间件',
    items: [
      { name: 'MySQL', level: 80 },
      { name: 'Redis', level: 70 },
      { name: 'RabbitMQ', level: 65 },
      { name: 'Nginx', level: 60 },
      { name: 'Docker', level: 50 }
    ]
  },
  {
    name: '开发工具',
    items: [
      { name: 'Git', level: 75 },
      { name: 'Maven', level: 70 },
      { name: 'IDEA', level: 90 }
    ]
  }
])

// 根据技能等级返回不同的颜色
const getProgressColor = (level) => {
  if (level >= 80) return '#67C23A'
  if (level >= 70) return '#409EFF'
  if (level >= 60) return '#E6A23C'
  return '#F56C6C'
}

// 标签类型循环
const getTagType = (level) => {
  if (level >= 90) return 'danger'
  if (level >= 85) return 'success'
  if (level >= 75) return 'primary'
  if (level >= 60) return 'warning'
  return 'info'
}

// 博客统计数据
const stats = ref({
  articles: 50,    // 文章数量
  views: 10000,    // 访问量
  days: 365        // 运行天数
})

</script>

<style lang="scss" scoped>
.about-page {
  max-width: 800px;
  margin: 80px auto 40px;
  padding: 0 20px;
}

.profile-card {
  text-align: center;
  padding: 40px;
  background: var(--el-bg-color);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;

  .profile-header {
    .avatar {
      width: 120px;
      height: 120px;
      margin: 0 auto 20px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid var(--el-color-primary-light-8);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .name {
      font-size: 1.8em;
      margin: 0 0 10px;
      color: var(--el-text-color-primary);
    }

    .bio {
      color: var(--el-text-color-secondary);
      margin: 0 0 20px;
    }
  }

  .social-links {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
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
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .section {
    margin-bottom: 40px;

    h2 {
      font-size: 1.5em;
      margin-bottom: 20px;
      color: var(--el-text-color-primary);
    }

    .content-card {
      background: var(--el-bg-color);
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

      p {
        margin-bottom: 16px;
        line-height: 1.6;
        color: var(--el-text-color-regular);
      }

      ul {
        padding-left: 20px;

        li {
          margin-bottom: 8px;
          color: var(--el-text-color-regular);
        }
      }
    }

    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      .skill-tag {
        font-size: 14px;
        padding: 6px 12px;
      }
    }

    .timeline {
      p {
        font-weight: bold;
        margin-bottom: 12px;
      }
    }
  }
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .skill-tag {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    color: var(--el-text-color-regular);
    border: none;
  }
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  .stat-card {
    background: var(--el-bg-color);
    padding: 24px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    .stat-number {
      font-size: 2em;
      font-weight: bold;
      color: var(--el-color-primary);
      margin-bottom: 8px;
    }

    .stat-label {
      color: var(--el-text-color-secondary);
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
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .about-page {
    padding: 0 15px;
    margin-top: 60px;
  }

  .profile-card {
    padding: 30px 20px;
  }

  .stats-container {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;

  .skill-category-card {
    // 使用 CSS 变量来适应暗色模式
    background: var(--el-bg-color); // 改用 Element Plus 的背景色变量
    border-radius: 12px;
    padding: 20px;
    // 调整阴影使其在暗色模式下不那么突兀
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      // 暗色模式下的悬浮效果
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .category-header {
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--el-border-color); // 使用 Element Plus 的边框色变量

      h3 {
        font-size: 1.1em;
        color: var(--el-text-color-primary); // 使用 Element Plus 的文本色变量
        margin: 0;
      }
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .skill-tag {
        font-size: 13px;
        padding: 6px 12px;
        border-radius: 6px;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
}

// 响应式调整
@media screen and (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>