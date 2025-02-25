import { createI18n } from 'vue-i18n'

export default createI18n({
    locale: 'ja',
    fallbackLocale: 'en',
    messages: {
        en: {
            guard: {
                title: 'Japanese Language Proficiency Test-JLPT',
                description: 'An AI-powered platform for learning the JLPT.',
            },
            message: {
                hello: 'hello world',
            },
        },
        ja: {
            guard: {
                title: '日本語能力試験-JLPT',
                description: 'を学習するためのAIプラットフォーム。',
            },
            message: {
                hello: 'こんにちは、世界',
            },
        },
    },
})
