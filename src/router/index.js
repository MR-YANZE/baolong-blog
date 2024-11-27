import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/layouts/DefaultLayout.vue'),
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('@/views/Home.vue'),
                meta: {
                    title: '首页',
                    keepAlive: true
                },
            },
            {
                path: 'article/:id',
                name: 'Article',
                component: () => import('@/views/Article.vue')
            },
            {
                path: 'tag/:name',
                name: 'Tag',
                component: () => import('@/views/Tag.vue')
            },
            {
                path: '/friends',
                name: 'Friends',
                component: () => import('@/views/Friends.vue'),
                meta: {
                    title: '友情链接'
                }
            },
            {
                path: '/about',
                name: 'About',
                component: () => import('@/views/About.vue'),
                meta: {
                    title: '关于我'
                }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    // 滚到顶部
    // scrollBehavior(to, from, savedPosition) {
    //     return { top: 0 }
    // }
})

// 在路由配置文件中添加
router.beforeEach((to, from, next) => {
    // 设置页面标题
    document.title = to.meta.title ? `${to.meta.title} - 暴龙Baolong` : '暴龙Baolong'
    next()
})

export default router