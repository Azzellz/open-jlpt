import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import UserView from '@/views/user/UserView.vue'
import UserProfileView from '@/views/user/UserProfileView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/user',
            name: 'user',
            component: UserView,
            redirect: '/user/profile',
            children: [
                { path: 'profile', component: UserProfileView },
                { path: 'setting', component: () => import('@/views/user/UserSettingView.vue') },
                { path: 'history', component: () => import('@/views/user/UserHistoryView.vue') },
            ],
        },
        {
            path: '/jlpt/text',
            component: () => import('@/views/jlpt/JLPT-TextView.vue'),
        },
        {
            path: '/jlpt/vocabulary',
            component: () => import('@/views/jlpt/JLPT-VocabularyView.vue'),
        },
        {
            path: '/jlpt/grammar',
            component: () => import('@/views/jlpt/JLPT-GrammarView.vue'),
        },
        {
            path: '/jlpt/read',
            component: () => import('@/views/jlpt/JLPT-ReadView.vue'),
        },
        {
            path: '/jlpt/hearing',
            component: () => import('@/views/jlpt/JLPT-HearingView.vue'),
        },
    ],
})

// 重定向不存在的页面到主页
router.beforeEach((to) => {
    if (to.matched.length === 0) {
        return { name: 'home' }
    }
})

export default router
