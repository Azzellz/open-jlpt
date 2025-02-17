<script setup lang="ts">
import API from '@/api'
import { onMounted, ref } from 'vue'

const content = ref('')
const reasoning = ref('')
const template = `
{
    article: {
        title: string
        content: string[]
    }
    questions: {
        number: number
        type: string
        question: string
        options: string[]
        answer: number
    }[]
    vocabList: {
        word: string
        definition: string
    }[]
    structure: {
        paragraph_focus: string[]
    }
}
`

onMounted(async () => {
    await API.AI.deepseek.chatByStream(
        [
            {
                role: 'system',
                content: `根据用户给出的主题，生成一篇 JLPT N1 难度的阅读题，只回复 JSON 格式的数据，JSON 格式为${template}`,
            },
            {
                role: 'user',
                content: '游戏',
            },
        ],
        (result) => {
            if (result.data.type === 'content') {
                content.value += result.data.content
            } else {
                reasoning.value += result.data.content
            }
        },
    )
})
</script>

<template>
    <main>
        <div class="flex flex-col gap-10">
            <div class="text-gray">{{ reasoning }}</div>
            <pre>{{ content }}</pre>
        </div>
    </main>
</template>
