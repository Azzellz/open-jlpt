import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView'
import UserView from '@/views/user/UserView'
import UserProfileView from '@/views/user/profile/UserProfileView'
import JLPT_ReadView from '@/views/jlpt/read/JLPT-ReadView'

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
                {
                    path: 'setting',
                    component: () => import('@/views/user/setting/UserSettingView'),
                },
                {
                    path: 'history',
                    component: () => import('@/views/user/history/UserHistoryView'),
                    redirect: '/user/history/read',
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
            redirect: '/jlpt/read/generate',
            component: JLPT_ReadView,
            children: [
                {
                    path: 'generate',
                    component: () => import('@/views/jlpt/read/JLPT-ReadGenerateView'),
                },
                {
                    path: 'hub',
                    component: () => import('@/views/jlpt/read/JLPT-ReadHubView'),
                },
                {
                    path: 'detail/:id',
                    component: () => import('@/views/jlpt/read/JLPT-ReadDetailView'),
                },
            ],
        },
        {
            path: '/jlpt/hearing',
            component: () => import('@/views/jlpt/JLPT-HearingView'),
        },
        {
            path: '/other/speech',
            component: () => import('@/views/other/SpeechView'),
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
