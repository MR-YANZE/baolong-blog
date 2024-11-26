<template>
    <footer class="nav-footer">
        <div class="container">
            <div class="footer-content">
                <!-- 左侧信息 -->
                <div class="footer-left">
                    <div class="site-info">
                        <h3>暴龙Baolong的博客</h3>
                        <p>记录生活，分享技术</p>
                    </div>
                    <div class="copyright">
                        <p>
                            © {{ currentYear }} Baolong
                            <span class="separator">|</span>
                            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">
                              浙ICP备2024136487号-1
                            </a>
                        </p>
                        <p class="powered-by">
                            Powered by
                            <a href="https://vuejs.org" target="_blank" rel="noopener">Vue.js</a>
                            &
                            <a href="https://element-plus.org" target="_blank" rel="noopener">Element Plus</a>
                        </p>
                    </div>
                </div>

                <!-- 右侧链接 -->
                <div class="footer-right">
                    <div class="link-section">
                        <h4>快速链接</h4>
                        <ul>
                            <li><router-link to="/about">关于我</router-link></li>
                            <li><router-link to="/friends">友情链接</router-link></li>
                            <li><router-link to="/archive">文章归档</router-link></li>
                            <li><a href="/rss.xml" target="_blank">RSS 订阅</a></li>
                        </ul>
                    </div>
                    <div class="link-section">
                        <h4>社交媒体</h4>
                        <div class="social-links">
                            <a href="https://github.com/yourusername" target="_blank" rel="noopener" title="GitHub">
                                <el-icon>
                                    <Platform />
                                </el-icon>
                            </a>
                            <a href="mailto:your.email@example.com" title="Email">
                                <el-icon>
                                    <Message />
                                </el-icon>
                            </a>
                            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener" title="Twitter">
                                <el-icon>
                                    <Position />
                                </el-icon>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { Platform, Message, Position } from '@element-plus/icons-vue'

const currentYear = new Date().getFullYear()
</script>

<style lang="scss" scoped>
.nav-footer {
    padding: 40px 0;
    background-color: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color-light);
    // margin-top: 40px;

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .footer-content {
        display: flex;
        justify-content: space-between;
        gap: 40px;

        .footer-left {
            flex: 2;

            .site-info {
                margin-bottom: 20px;

                h3 {
                    font-size: 1.5rem;
                    color: var(--el-text-color-primary);
                    margin-bottom: 8px;
                }

                p {
                    color: var(--el-text-color-secondary);
                    font-size: 14px;
                }
            }

            .copyright {
                color: var(--el-text-color-secondary);
                font-size: 14px;

                p {
                    margin-bottom: 8px;
                }

                a {
                    color: var(--el-text-color-secondary);
                    text-decoration: none;
                    transition: color 0.3s;

                    &:hover {
                        color: var(--el-color-primary);
                    }
                }

                .separator {
                    margin: 0 8px;
                    color: var(--el-border-color);
                }

                .powered-by {
                    font-size: 13px;
                }
            }
        }

        .footer-right {
            flex: 1;
            display: flex;
            justify-content: space-around;
            gap: 40px;

            .link-section {
                h4 {
                    font-size: 16px;
                    color: var(--el-text-color-primary);
                    margin-bottom: 16px;
                }

                ul {
                    list-style: none;
                    padding: 0;

                    li {
                        margin-bottom: 8px;

                        a {
                            color: var(--el-text-color-secondary);
                            text-decoration: none;
                            font-size: 14px;
                            transition: color 0.3s;

                            &:hover {
                                color: var(--el-color-primary);
                            }
                        }
                    }
                }

                .social-links {
                    display: flex;
                    gap: 16px;

                    a {
                        color: var(--el-text-color-secondary);
                        font-size: 20px;
                        transition: color 0.3s;

                        &:hover {
                            color: var(--el-color-primary);
                        }
                    }
                }
            }
        }
    }
}

// 响应式设计
@media screen and (max-width: 768px) {
    .nav-footer {
        .footer-content {
            flex-direction: column;
            text-align: center;

            .footer-right {
                flex-direction: column;
                gap: 24px;

                .social-links {
                    justify-content: center;
                }
            }
        }
    }
}
</style>