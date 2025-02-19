<script setup lang="ts">
import API from '@/api'
import { computed, onMounted, ref } from 'vue'
import { createJsonBrook } from 'json-brook'
import type { JLPT_Article } from '@root/models'
import { NCard, NDivider, NButton, NInput, NSelect } from 'naive-ui'
import { isSuccessResponse, Log } from '@root/shared'
import { useConfigStore } from '@/stores/config'

const jsonBrook = createJsonBrook()
const configStore = useConfigStore()

const content = ref('')
const reasoning = ref('')
const isReasoning = ref(true)
const currentLLMID = ref('')
const llmOptions = computed(() => {
    if (configStore.config) {
        return configStore.config.llms.map((llm) => {
            return { label: llm.name, value: llm.id }
        })
    } else {
        return []
    }
})
const level = ref<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N1')
const levelOptions = [
    {
        label: 'N1',
        value: 'N1',
    },
    {
        label: 'N2',
        value: 'N2',
    },
    {
        label: 'N3',
        value: 'N3',
    },
    {
        label: 'N4',
        value: 'N4',
    },
    {
        label: 'N5',
        value: 'N5',
    },
]
const theme = ref('')
const template = `
{
    article: {
        title: string
        contents: string[]
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

const jlpt_article = ref<Partial<JLPT_Article> | null>(null)

function mergeFragment(fragment: Partial<JLPT_Article>) {
    jlpt_article.value = fragment
}

function isValidJsonFragment(fragment: string) {
    return fragment && fragment !== '```' && fragment !== 'json'
}

async function generateArticle() {
    await API.LLM.chatByStream(
        currentLLMID.value,
        [
            {
                role: 'system',
                content: `根据用户给出的主题，生成一篇 JLPT ${level.value} 难度的阅读题，只回复 JSON 格式的数据，JSON 格式为${template}`,
            },
            {
                role: 'user',
                content: theme.value,
            },
        ],
        (result) => {
            if (result.data.type === 'content' && isValidJsonFragment(result.data.content)) {
                content.value += result.data.content
                jsonBrook.write(result.data.content)
                mergeFragment(jsonBrook.getCurrent() || {})
            } else if (result.data.type === 'reasoning') {
                reasoning.value += result.data.content
            }
        },
    )
    jsonBrook.end()
}

onMounted(async () => {
    const result = await API.Config.getConfig()
    if (isSuccessResponse(result)) {
        configStore.config = result.data
        console.log(result.data)
        Log.success(result.message)
    }
})
</script>

<template>
    <main>
        <div class="flex gap-5">
            <n-input v-model:value="theme" type="text" placeholder="请输入主题" />
            <n-select v-model:value="level" :options="levelOptions" />
            <n-select v-model:value="currentLLMID" :options="llmOptions" />
            <n-button @click="generateArticle">开始生成</n-button>
        </div>
        <div class="flex flex-col">
            <n-card :title="isReasoning ? '思考中...' : '思考过程'" class="text-gray">
                {{ reasoning }}
            </n-card>
            <n-divider />
            <!-- 阅读题卡片 -->
            <n-card v-if="jlpt_article?.article?.title" :title="jlpt_article?.article?.title">
                <!-- 内容部分 -->
                <div v-if="jlpt_article?.article?.contents" class="flex flex-col gap-5">
                    <div v-for="content in jlpt_article?.article.contents">
                        {{ content }}
                    </div>
                </div>
                <n-divider />
                <!-- 问题部分 -->
                <div v-if="jlpt_article?.questions" class="flex flex-col gap-5">
                    <div
                        v-for="question in jlpt_article?.questions"
                        class="flex flex-col gap-5 items-center"
                    >
                        <!-- 题干 -->
                        <div class="flex gap-5 items-center">
                            <div>{{ question.number }}</div>
                            <div>{{ question.type }}</div>
                            <div>{{ question.question }}</div>
                        </div>
                        <!-- 选项 -->
                        <n-button v-for="option in question.options" class="flex gap-5">
                            {{ option }}
                        </n-button>
                    </div>
                </div>
            </n-card>
        </div>
    </main>
</template>
