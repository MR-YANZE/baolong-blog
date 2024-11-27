import { defineStore } from 'pinia'

// 模拟文章数据 - 确保这些数据被正确创建
const mockArticles = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    title: `文章标题 ${index + 1}`,
    excerpt: '这是一段文章摘要，描述了文章的主要内容。这是一段文章摘要，描述了文章的主要内容。',
    cover: `https://picsum.photos/seed/${index + 1}/800/400`,
    tags: ['Vue', 'JavaScript', 'Web开发'],
    createTime: '2024-01-01',
    views: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
}))

export const useArticleStore = defineStore('article', {
    state: () => ({
        articles: mockArticles,
        total: mockArticles.length
    }),

    actions: {
        async getArticles({ page = 1, pageSize = 10 } = {}) {
            // 模拟API请求延迟
            // await new Promise(resolve => setTimeout(resolve, 500))

            const start = (page - 1) * pageSize
            const end = start + pageSize
            const data = mockArticles.slice(start, end)

            return {
                data,
                total: this.total
            }
        }
    }
})