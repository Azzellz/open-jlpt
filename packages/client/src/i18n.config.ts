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
            jlpt: {
                grammar: '语法',
                hearing: '听力',
                read: '阅读',
                vocabulary: '词汇',
                text: '文字',
            },
            nav: {},
            user: {
                menu: {
                    profile: '用户资料',
                    setting: '用户设置',
                    history: '历史记录',
                },
            },
        },
        en: {
            guard: {
                title: 'Japanese Language Proficiency Test-JLPT',
                description:
                    'An AI-powered platform for learning JLPT that supports all JLPT question types and personalized learning content.',
            },
            jlpt: {
                grammar: 'grammar',
                hearing: 'hearing',
                read: 'read',
                vocabulary: 'vocabulary',
                text: 'text',
            },
            nav: {},
            user: {
                menu: {
                    profile: 'profile',
                    setting: 'setting',
                    history: 'history',
                },
            },
        },
        ja: {
            guard: {
                title: '日本語能力試験-JLPT',
                description:
                    '日本語能力試験を学習するためのAI主導のプラットフォームで、日本語能力試験の全問題形式とパーソナライズされた学習コンテンツをサポートします。',
            },
            jlpt: {
                grammar: '文法',
                hearing: '聴解',
                read: '読解',
                vocabulary: '文脈規定',
                text: '漢字読み',
            },
            nav: {},
            user: {
                menu: {
                    profile: 'プロファイル',
                    setting: '設定',
                    history: '歴史的記録',
                },
            },
        },
    },
})
