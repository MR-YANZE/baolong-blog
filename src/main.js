import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './assets/styles/main.scss'
import 'virtual:svg-icons-register'

// 消息提示注册到全局
import { ElMessage } from 'element-plus'
window.$message = ElMessage

// 初始化 Markdown 辅助函数
import { initMarkdownHelpers } from './utils/markdown'
initMarkdownHelpers()

const app = createApp(App)
const pinia = createPinia()
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')