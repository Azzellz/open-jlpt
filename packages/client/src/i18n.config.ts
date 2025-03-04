import { createI18n } from 'vue-i18n'

export default createI18n({
    legacy: false,
    locale: 'zh',
    fallbackLocale: 'jp',
    messages: {
        zh: {
            guard: {
                title: '日本语能力考试-JLPT',
                description:
                    '一个用于学习 JLPT 的 AI 驱动的平台，支持 JLPT 全部题型以及个性化学习内容。',
            },
        },
        en: {
            guard: {
                title: 'Japanese Language Proficiency Test-JLPT',
                description:
                    'An AI-powered platform for learning JLPT that supports all JLPT question types and personalized learning content.',
            },
        },
        ja: {
            guard: {
                title: '日本語能力試験-JLPT',
                description:
                    '日本語能力試験を学習するためのAI主導のプラットフォームで、日本語能力試験の全問題形式とパーソナライズされた学習コンテンツをサポートします。',
            },
        },
    },
})
