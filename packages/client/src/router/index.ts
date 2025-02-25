import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UserView from '@/views/UserView.vue'

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

export default router
