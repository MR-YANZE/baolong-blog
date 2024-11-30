import { defineStore } from 'pinia'

// 模拟文章数据 - 确保这些数据被正确创建
const mockArticles = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    title: `文章标题 ${index + 1}`,
    excerpt: '这是一段文章摘要，描述了文章的主要内容。这是一段文章摘要，描述了文章的主要内容。',
    cover: `https://picsum.photos/seed/${index + 1}/800/400`,
    tags: ['Vue', 'JavaScript', 'Web开发'],
    category: ['前端开发', '后端开发', '开发工具'][Math.floor(Math.random() * 3)], // 随机分配分类
    createTime: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(), // 随机日期
    views: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
}))

export const useArticleStore = defineStore('article', {
    state: () => ({
        articles: mockArticles,
        total: mockArticles.length,
        categories: [] // 存储分类信息
    }),

    getters: {
        // 获取所有分类及其文章数量
        getCategoriesWithCount: (state) => {
            const categoryCount = state.articles.reduce((acc, article) => {
                acc[article.category] = (acc[article.category] || 0) + 1
                return acc
            }, {})

            return Object.entries(categoryCount).map(([name, count]) => ({
                name,
                count
            }))
        },

        // 获取文章总数
        totalArticles: (state) => state.articles.length
    },

    actions: {
        // 获取分页文章列表
        async getArticles({ page = 1, pageSize = 10, category = '' } = {}) {
            // 根据分类筛选文章
            let filteredArticles = category
                ? this.articles.filter(article => article.category === category)
                : this.articles

            const start = (page - 1) * pageSize
            const end = start + pageSize
            const data = mockArticles.slice(start, end)

            return {
                data,
                total: filteredArticles.length
            }
        },

        // 获取所有分类
        async getCategories() {
            // 在实际应用中，这里应该是一个 API 调用
            return this.getCategoriesWithCount
        },

        // 根据分类获取文章
        getArticlesByCategory(category) {
            if (!category) return this.articles
            return this.articles.filter(article => article.category === category)
        },

        // 获取指定文章
        async getArticleById(id) {
            return this.articles.find(article => article.id === id)
        }
    }
})