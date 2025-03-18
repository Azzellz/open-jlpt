import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView'
import UserView from '@/views/user/UserView'
import UserProfileView from '@/views/user/UserProfileView'

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
                { path: 'setting', component: () => import('@/views/user/UserSettingView') },
                {
                    path: 'history',
                    // component: () => import('@/views/user/history/UserHistoryView'),
                    children: [
                        {
                            path: 'read',
                            component: () => import('@/views/user/history/UserHistoryReadView'),
                        },
                    ],
                },
            ],
        },
        {
            path: '/jlpt/text',
            component: () => import('@/views/jlpt/JLPT-TextView'),
        },
        {
            path: '/jlpt/vocabulary',
            component: () => import('@/views/jlpt/JLPT-VocabularyView'),
        },
        {
            path: '/jlpt/grammar',
            component: () => import('@/views/jlpt/JLPT-GrammarView'),
        },
        {
            path: '/jlpt/read',
            component: () => import('@/views/jlpt/JLPT-ReadView'),
        },
        {
            path: '/jlpt/hearing',
            component: () => import('@/views/jlpt/JLPT-HearingView'),
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
