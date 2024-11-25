import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../layouts/DefaultLayout.vue'),
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('../views/Home.vue')
            },
            {
                path: 'article/:id',
                name: 'Article',
                component: () => import('../views/Article.vue')
            },
            {
                path: 'tag/:name',
                name: 'Tag',
                component: () => import('../views/Tag.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router