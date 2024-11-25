import { ref, onMounted, watch } from 'vue'
import { updateCodeTheme } from '@/utils/markdown'

export function useTheme() {
    const isDark = ref(false)

    // 初始化主题
    const initTheme = () => {
        // 优先从本地存储获取主题设置
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            isDark.value = savedTheme === 'dark'
        } else {
            // 如果没有保存的主题，则使用系统主题
            isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        applyTheme()
        updateCodeTheme(isDark.value)
    }

    // 切换主题
    const toggleTheme = () => {
        isDark.value = !isDark.value
        applyTheme()
    }

    // 应用主题
    const applyTheme = () => {
        // 更新 HTML 的 class
        document.documentElement.classList.toggle('dark', isDark.value)
        // 保存主题设置到本地存储
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
        // 更新 Element Plus 主题
        document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
        // 更新代码主题
        updateCodeTheme(isDark.value)
    }

    // 监听系统主题变化
    onMounted(() => {
        initTheme()
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                isDark.value = e.matches
                applyTheme()
            }
        })
    })

    // 监听主题变化
    watch(isDark, (newValue) => {
        document.documentElement.classList.toggle('dark', newValue)
        updateCodeTheme(newValue)
    }, { immediate: true })

    return {
        isDark,
        toggleTheme
    }
}